<script setup>
import { useBoardStore } from "~/stores/boardStore";

const props = defineProps({
    column: {
        type: Object,
        Required: true,
    },
    columnIndex: {
        type: Object,
        Required: true,
    },
});

const boardStore = useBoardStore();
const router = useRouter();

const editNameState = ref(false);
const newTaskName = ref("");

function addTask() {
    boardStore.addTask({
        taskName: newTaskName.value,
        columnIndex: props.columnIndex,
    });
    newTaskName.value = "";
}

function deleteColumn(columnIndex) {
    boardStore.deleteColumn(columnIndex);
}

function dropTask(event, toColumnIndex) {
    const fromColumnIndex = event.dataTransfer.getData('from-column-index')
    const fromTaskIndex = event.dataTransfer.getData('from-task-index')
    console.log({ fromColumnIndex, fromTaskIndex });

    boardStore.moveTask({
        taskIndex: fromTaskIndex,
        fromColumnIndex,
        toColumnIndex
    })
}

function goToTask(taskId) {
    router.push(`/tasks/${taskId}`);
}

function pickupTask(event, { fromColumnIndex, fromTaskIndex }) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.setData('from-column-index', fromColumnIndex)
    event.dataTransfer.setData('from-task-index', fromTaskIndex)
}
</script>

<template>
    <UContainer
        class="column"
        @dragenter.prevent
        @dragover.prevent
        @drop.stop="dropTask($event, columnIndex)">
        <div class="column-header mb-4">
            <div>
                <UInput
                    v-if="editNameState"
                    type="text"
                    v-model="column.name"
                    @keyup.enter="editNameState = !editNameState"
                />
                <h2 v-else>{{ column.name }}</h2>
            </div>
            <div>
                <UButton
                    icon="i-heroicons-pencil-square"
                    class="mr-2"
                    @click="editNameState = !editNameState"
                />
                <UButton
                    icon="i-heroicons-trash"
                    color="red"
                    @click="deleteColumn(columnIndex)"
                />
            </div>
        </div>
        <ul>
            <li v-for="( task, taskIndex ) in column.tasks" :key="task.id">
                <UCard
                    class="mb-4"
                    @click="goToTask(task.id)"
                    draggable="true"
                    @dragstart="pickupTask($event, {
                        fromColumnIndex: columnIndex,
                        fromTaskIndex: taskIndex
                    })"
                >
                    <strong>{{ task.name }}</strong>
                    <p>{{ task.description }}</p>
                </UCard>
            </li>
        </ul>
        <UInput
            v-model="newTaskName"
            type="text"
            placeholder="Create new task"
            icon="i-heroicons-solid-plus-circle"
            @keyup.enter="addTask"
        />
    </UContainer>
</template>
