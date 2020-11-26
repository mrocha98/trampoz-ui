<template>
  <section class="jobs">
    <Card>
      <template v-slot:content>
        <Toolbar>
          <template v-slot:left>
            <Button label="Reload" icon="pi pi-refresh" class="p-mr-2 p-button-info" @click="fetchJobs()" />
            <Button label="New" icon="pi pi-plus" />
          </template>

          <template v-slot:right>
            <span class="p-mr-1">Page: {{ page }} of {{ pages }}</span>
            <div class="p-mx-3 p-d-flex p-jc-between" style="width: 5.25rem">
              <Button icon="pi pi-chevron-left" class="p-button-raised p-button-rounded p-button-secondary" @click="goToPeviousPage()" :disabled="!hasPreviousPage" />
              <Button icon="pi pi-chevron-right" class="p-button-raised p-button-rounded p-button-secondary" @click="goToNextPage()" :disabled="!hasNextPage" />
            </div>
            <div>
              <span class="p-d-block">Items:</span>
              <Dropdown v-model="limit" :options="limitOptions" optionLabel="value" optionValue="value" @change="fetchJobs()" />
            </div>
          </template>
        </Toolbar>

        <DataTable :value="jobs" :rowHover="true" class="p-mt-5">
          <template #header>
            <div class="p-d-flex p-jc-between">
              <h2 class="p-m-0">Jobs</h2>
              <strong>Total: {{ total }}</strong>
            </div>
          </template>

          <Column field="title" header="Title"></Column>
          <Column field="description" header="Description"></Column>
          <Column header="Publishing Date">
            <template #body="slotProps">
              <span>{{ slotProps.data.publishingDate }}</span>
            </template>
          </Column>
          <Column header="Location">
            <template #body="slotProps">
              <span>{{ slotProps.data.state }} - {{ slotProps.data.city }}</span>
            </template>
          </Column>
          <Column header="Type">
            <template #body="slotProps">
              <span v-if="slotProps.data.isRemote" class="p-tag p-tag-warning">REMOTE</span>
              <span v-else class="p-tag p-tag-info">PRESENTIAL</span>
            </template>
          </Column>
          <Column header="Status">
            <template #body="slotProps">
              <span v-if="slotProps.data.isOpen" class="p-tag p-tag-success">OPEN</span>
              <span v-else class="p-tag p-tag-danger">CLOSED</span>
            </template>
          </Column>
          <Column header="Actions" >
            <template #body="slotProps">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning p-mr-2" @click="editJob(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="openDeleteDialog(slotProps.data)" />
            </template>
          </Column>

          <template #empty>
            <p>No records found... ¯\_(ツ)_/¯</p>
          </template>
        </DataTable>
      </template>
    </Card>

    <Dialog :visible="dialog.isDeleteOpen" :closable="false" header="Confirmation" :modal="true" style="min-width: 50%">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1rem" />
        <span v-if="dialog.job">The job: "{{ dialog.job.title }}" will be deleted</span>
        <p>Proceed?</p>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="dialog.isDeleteOpen = false"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="() => deleteJob(dialog.job.id)" />
      </template>
      </Dialog>
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue } from 'vue-class-component'
import { get, set } from 'lodash'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'
import { Job } from '@/store/state'

export default class Jobs extends Vue {
   store = useStore()

   jobs = computed(() => this.store.state.fetchedJobs.jobs)
   total = computed(() => this.store.state.fetchedJobs.total)
   pages = computed(() => this.store.state.fetchedJobs.pages)
   hasPreviousPage = computed(() => this.store.state.fetchedJobs.hasPreviousPage)
   hasNextPage = computed(() => this.store.state.fetchedJobs.hasNextPage)

   page = 1
   limit = 5

  limitOptions = [
    { value: 5 },
    { value: 10 },
    { value: 15 },
    { value: 20 }
  ]

   dialog = {
     isCreationOpen: false,
     isEditOpen: false,
     isDeleteOpen: false,
     job: {} as Job
   }

   async fetchJobs () {
     const paginationParams = { page: this.page, limit: this.limit }
     await this.store.dispatch(ActionTypes.FetchJobs, paginationParams)
   }

   async mounted () {
     await this.fetchJobs()
   }

   async goToNextPage () {
     this.page++
     await this.fetchJobs()
   }

   async goToPeviousPage () {
     this.page--
     await this.fetchJobs()
   }

   openDeleteDialog (job: Job) {
     const id = get(job, 'id')
     const title = get(job, 'title')

     set(this.dialog, 'job.id', id)
     set(this.dialog, 'job.title', title)

     this.dialog.isDeleteOpen = true
   }

   async deleteJob (id: string) {
     try {
       await this.store.dispatch(ActionTypes.DeleteJob, { id })
     } catch (error) {
       console.log(error)
     } finally {
       this.dialog.isDeleteOpen = false
     }
   }
}
</script>
