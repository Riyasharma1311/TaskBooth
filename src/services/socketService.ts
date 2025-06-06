import { io, Socket } from 'socket.io-client';
import { SocketEvent, Task, Column, Board } from '@/types';

class SocketService {
    private socket: Socket | null = null;
    private currentBoardId: string | null = null;
    private callbacks: Map<string, Function[]> = new Map();

    connect(serverUrl: string = 'http://localhost:3001') {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            timeout: 5000,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.setupEventListeners();
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.currentBoardId = null;
        }
    }

    joinBoard(boardId: string, userId: string) {
        if (!this.socket) {
            console.warn('Socket not connected. Cannot join board.');
            return;
        }

        // Leave previous board if any
        if (this.currentBoardId && this.currentBoardId !== boardId) {
            this.leaveBoard(this.currentBoardId, userId);
        }

        this.currentBoardId = boardId;
        this.socket.emit('join_board', { boardId, userId });
    }

    leaveBoard(boardId: string, userId: string) {
        if (!this.socket) return;

        this.socket.emit('leave_board', { boardId, userId });
        if (this.currentBoardId === boardId) {
            this.currentBoardId = null;
        }
    }

    // Task events
    emitTaskCreated(task: Task, boardId: string, userId: string) {
        this.emitEvent('task_created', { task }, boardId, userId);
    }

    emitTaskUpdated(task: Task, boardId: string, userId: string) {
        this.emitEvent('task_updated', { task }, boardId, userId);
    }

    emitTaskDeleted(taskId: string, boardId: string, userId: string) {
        this.emitEvent('task_deleted', { taskId }, boardId, userId);
    }

    emitTaskMoved(taskId: string, fromColumnId: string, toColumnId: string, newOrder: number, boardId: string, userId: string) {
        this.emitEvent('task_moved', {
            taskId,
            fromColumnId,
            toColumnId,
            newOrder
        }, boardId, userId);
    }

    // Column events
    emitColumnCreated(column: Column, boardId: string, userId: string) {
        this.emitEvent('column_created', { column }, boardId, userId);
    }

    emitColumnUpdated(column: Column, boardId: string, userId: string) {
        this.emitEvent('column_updated', { column }, boardId, userId);
    }

    emitColumnDeleted(columnId: string, boardId: string, userId: string) {
        this.emitEvent('column_deleted', { columnId }, boardId, userId);
    }

    // Board events
    emitBoardUpdated(board: Board, userId: string) {
        this.emitEvent('board_updated', { board }, board.id, userId);
    }

    // Generic event emitter
    private emitEvent(type: string, data: any, boardId: string, userId: string) {
        if (!this.socket) {
            console.warn('Socket not connected. Cannot emit event:', type);
            return;
        }

        const event: SocketEvent = {
            type: type as any,
            data,
            boardId,
            userId,
            timestamp: new Date(),
        };

        this.socket.emit('board_event', event);
    }

    // Event listeners
    on(eventType: string, callback: Function) {
        if (!this.callbacks.has(eventType)) {
            this.callbacks.set(eventType, []);
        }
        this.callbacks.get(eventType)!.push(callback);
    }

    off(eventType: string, callback?: Function) {
        if (!callback) {
            this.callbacks.delete(eventType);
        } else {
            const callbacks = this.callbacks.get(eventType);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
    }

    private setupEventListeners() {
        if (!this.socket) return;

        // Connection events
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.emit('connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.emit('disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.emit('connection_error', error);
        });

        // Board events
        this.socket.on('board_event', (event: SocketEvent) => {
            this.emit('board_event', event);
            this.emit(event.type, event);
        });

        // User events
        this.socket.on('user_joined', (data) => {
            this.emit('user_joined', data);
        });

        this.socket.on('user_left', (data) => {
            this.emit('user_left', data);
        });

        // Real-time notifications
        this.socket.on('notification', (data) => {
            this.emit('notification', data);
        });
    }

    private emit(eventType: string, data?: any) {
        const callbacks = this.callbacks.get(eventType);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in socket callback:', error);
                }
            });
        }
    }

    // Getters
    get isConnected(): boolean {
        return this.socket?.connected || false;
    }

    get currentBoard(): string | null {
        return this.currentBoardId;
    }
}

// Create singleton instance
export const socketService = new SocketService();

// Auto-connect when service is imported (optional)
// You might want to connect explicitly based on user authentication
// socketService.connect();
