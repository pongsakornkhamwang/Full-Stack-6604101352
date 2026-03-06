<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-pt-md text-center text-weight-bold text-primary">
      📋 Task Manager
    </div>
    <div class="text-subtitle1 q-mb-md text-center text-grey-8">
      จัดทำโดย: พงศกร คำวัง (6604101352)
    </div>

    <div class="row justify-center q-mb-md">
      <q-btn
        color="primary"
        icon="add"
        label="Add Task"
        @click="showAddDialog = true"
      />
      <q-btn
        class="q-ml-sm"
        color="secondary"
        icon="refresh"
        label="Refresh"
        @click="fetchTasks"
      />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card v-if="loading" class="q-pa-lg text-center">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-sm">Loading tasks...</div>
        </q-card>

        <q-card v-else-if="error" class="q-pa-lg text-center text-negative">
          <q-icon name="error" size="3em" />
          <div class="q-mt-sm">{{ error }}</div>
          <q-btn class="q-mt-md" color="primary" label="Retry" @click="fetchTasks" />
        </q-card>

        <q-list v-else bordered separator class="rounded-borders">
          <q-item v-if="tasks.length === 0">
            <q-item-section class="text-center text-grey">
              No tasks found. Add a new task!
            </q-item-section>
          </q-item>

          <q-item v-for="task in tasks" :key="task.id" class="q-pa-md">
            <q-item-section side>
              <q-checkbox
                :model-value="task.completed"
                color="positive"
                @update:model-value="toggleTask(task)"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label
                :class="{ 'text-strike text-grey': task.completed }"
                class="text-body1"
              >
                {{ task.title }}
              </q-item-label>
              <q-item-label
                v-if="task.description"
                caption
                :class="{ 'text-strike': task.completed }"
              >
                {{ task.description }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="deleteTask(task.id)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <!-- Add Task Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add New Task</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="newTask.title"
            label="Task Title *"
            dense
            autofocus
          />
          <q-input
            v-model="newTask.description"
            label="Description"
            dense
            class="q-mt-sm"
            type="textarea"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Add Task"
            @click="addTask"
            :disable="!newTask.title"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const tasks = ref([])
const loading = ref(true)
const error = ref(null)
const showAddDialog = ref(false)
const newTask = ref({ title: '', description: '' })

const fetchTasks = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/tasks')
    tasks.value = response.data
  } catch (err) {
    console.error('Error fetching tasks:', err)
    error.value = 'Failed to load tasks. Please check API connection.'
  } finally {
    loading.value = false
  }
}

const addTask = async () => {
  if (!newTask.value.title) return
  try {
    await api.post('/tasks', {
      title: newTask.value.title,
      description: newTask.value.description || null
    })
    newTask.value = { title: '', description: '' }
    showAddDialog.value = false
    await fetchTasks()
  } catch (err) {
    console.error('Error adding task:', err)
  }
}

const toggleTask = async (task) => {
  try {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      completed: !task.completed
    })
    await fetchTasks()
  } catch (err) {
    console.error('Error updating task:', err)
  }
}

const deleteTask = async (id) => {
  try {
    await api.delete(`/tasks/${id}`)
    await fetchTasks()
  } catch (err) {
    console.error('Error deleting task:', err)
  }
}

onMounted(() => {
  fetchTasks()
})
</script>
