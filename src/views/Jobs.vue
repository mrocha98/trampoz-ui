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

        <DataTable :value="jobs" class="p-mt-5">
          <template #header>
            <div class="p-d-flex p-jc-between">
              <h2 class="p-m-0">Jobs</h2>
              <strong>Total: {{ total }}</strong>
            </div>
          </template>

          <Column field="title" header="Title"></Column>
          <Column field="description" header="Description"></Column>
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

    <Dialog :visible="dialog.isDeleteOpen" :closable="false" header="Delete confirmation" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1rem" />
        <span>{{ dialog.job.title }}</span>
        <span v-if="dialog.job">Are you sure?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="dialog.isDeleteOpen = false"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="console.log('zap')" />
      </template>
      </Dialog>
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue } from 'vue-class-component'
import { get, assign } from 'lodash'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'
import { Job } from '@/store/state'

export default class Jobs extends Vue {
  public store = useStore()

  public jobs = computed(() => this.store.state.fetchedJobs.jobs)
  public total = computed(() => this.store.state.fetchedJobs.total)
  public pages = computed(() => this.store.state.fetchedJobs.pages)
  public hasPreviousPage = computed(() => this.store.state.fetchedJobs.hasPreviousPage)
  public hasNextPage = computed(() => this.store.state.fetchedJobs.hasNextPage)

  public page = 1
  public limit = 5

  readonly limitOptions = [
    { value: 5 },
    { value: 10 },
    { value: 15 },
    { value: 20 }
  ]

  public dialog = {
    isCreationOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    job: {} as Job
  }

  public async fetchJobs () {
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

    assign(this.dialog.job, id, title)
    this.dialog.isDeleteOpen = true
  }
}
</script>
