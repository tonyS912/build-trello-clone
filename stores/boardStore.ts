import { v4 as uuid } from 'uuid'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import boardData from '~/data/board.json'

export const useBoardStore = defineStore('boardStore', () => {
    /**
     * Board State
     */
    const board = useStorage('board', boardData)

    /**
     * Getters
     */
    const getTask = computed(() => {
        return (taskId: string) => {
            for (const column of board.value.columns) {
                const task = column.tasks.find(task => task.id === taskId)
                if (task) return task
            }
        }
    })

    /**
     * Actions
     * @param columnIndex = Column Index
     * @param taskName = Task Name
     */
    function addTask({ columnIndex, taskName }: { columnIndex: number, taskName: string }) {
        board.value.columns[columnIndex].tasks.push({
            id: uuid(),
            name: taskName,
            description: ''
        })
    }

    /**
     * @param taskId = Task Id
     * @returns the task will be deleted
     */
    function deleteTask(taskId: string) {
        for (const column of board.value.columns) {
            const taskIndex = column.tasks.findIndex(task => task.id === taskId)

            if (taskIndex !== -1) {
                column.tasks.splice(taskIndex, 1) 
                return
            }
        }
    }

    function moveTask({ fromTaskIndex, toTaskIndex, fromColumnIndex, toColumnIndex }: { fromTaskIndex: number, toTaskIndex: number, fromColumnIndex: number, toColumnIndex: number }) {
        const task = board.value.columns[fromColumnIndex].tasks.splice(fromTaskIndex, 1 )[0]

        board.value.columns[toColumnIndex].tasks.splice(toTaskIndex, 0, task)
    }

    function addColumn(columnName: string) {
        board.value.columns.push({
            id: uuid(),
            name: columnName,
            tasks: []
        })
    }

    function deleteColumn(columnIndex: number) {
        board.value.columns.splice(columnIndex, 1)
    }

    function moveColumn({ fromColumnIndex, toColumnIndex }: { fromColumnIndex: number, toColumnIndex: number }) {
        const column = board.value.columns.splice(fromColumnIndex, 1)[0]
        board.value.columns.splice(toColumnIndex, 0, column)
    }

    return {
        /* State */
        board,
        /* Getters */
        getTask,
        /* Actions */
        addColumn,
        addTask,
        deleteColumn,
        deleteTask,
        moveTask,
        moveColumn
    }
})