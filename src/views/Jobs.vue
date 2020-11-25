<template>
  <section class="jobs">
    <Card>
      <template v-slot:content>
        <Toolbar>
          <template v-slot:left>
            <Button label="Reload" icon="pi pi-refresh" class="p-mr-2 p-button-secondary" @click="fetchJobs()" />
            <Button label="New" icon="pi pi-plus" />
          </template>

          <template v-slot:right>
            <span class="p-mr-1">Page: {{ page }} of {{ pages}}</span>
            <div class="p-mx-3 p-d-flex p-jc-between" style="width: 5.25rem">
              <Button icon="pi pi-chevron-left" class="p-button-raised p-button-rounded p-button-secondary" @click="goToPeviousPage()" :disabled="!hasPreviousPage" />
              <Button icon="pi pi-chevron-right" class="p-button-raised p-button-rounded p-button-secondary" @click="goToNextPage()" :disabled="!hasNextPage" />
            </div>
            <div>
              <span class="p-d-block">Items:</span>
              <Dropdown v-model="limit" :options="limitOptions" optionLabel="value" optionValue="value" @change="fetchJobs()" de />
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
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning p-mr-2" @click="editProduct(slotProps.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(slotProps.data)" />
            </template>
          </Column>

          <template #empty>
            No records found.
          </template>
        </DataTable>
      </template>
    </Card>
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue } from 'vue-class-component'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'

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
}
</script>
