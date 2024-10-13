<script setup>
import { useBoardStore } from "~/stores/boardStore";

const boardStore = useBoardStore();
const route = useRoute();
const router = useRouter();

const task = computed(() => {
    return boardStore.getTask(route.params.id);
});

function deleteTask() {
    boardStore.deleteTask(route.params.id);
    router.push("/");
}
</script>

<template>
    <div class="task-wrapper">
        <div v-if="task" class="task-view">
            <UFormGroup label="name" class="w-full mb-4">
                <UInput type="text" v-model="task.name" />
            </UFormGroup>
            <UFormGroup label="description" class="w-full mb-4">
                <UTextarea v-model="task.description" />
            </UFormGroup>
            <UButton
                icon="i-heroicons-trash"
                label="Delete Task"
                color="red"
                @click="deleteTask(taskId)"
            />
        </div>
        <div v-else>
            <p>Task not found</p>
        </div>
    </div>
</template>
