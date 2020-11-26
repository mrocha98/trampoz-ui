<template>
  <section class="jobs">
    <Card>
      <template v-slot:content>
        <Toolbar>
          <template v-slot:left>
            <Button label="Reload" icon="pi pi-refresh" class="p-mr-2 p-button-info" @click="fetchJobs()" />
            <Button label="New" icon="pi pi-plus" @click="openCreateDialog()" />
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
          <Column header="Contractor">
            <template #body="slotProps">
              <figure>
                <img class="rounded-image" :src="slotProps.data.contractor.companyLogoLink" />
                <figcaption>{{ slotProps.data.contractor.companyName }}</figcaption>
              </figure>
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
          <Column header="Actions">
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

    <Dialog :visible="dialog.isDeleteOpen" :closable="false" header="Confirmation" :modal="true" style="min-width: 30%">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 1rem" />
        <span v-if="dialog.job">The job: "{{ dialog.job.title }}" will be deleted</span>
        <p>Proceed?</p>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="closeDeleteDialog()"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="() => deleteJob(dialog.job.id)" />
      </template>
    </Dialog>

    <Dialog :visible="dialog.isCreateOpen" :closable="false" header="Create a new job" :modal="true" style="min-width: 50%">
      <form @submit.prevent="createJob" class="p-text-left">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12">
            <label for="contractor">Contractor</label>
            <Dropdown id="contractor" name="contractor" v-model="dialog.job.contractor" placeholder="Select a Contractor"
              :options="contractors" optionLabel="companyName" :showClear="true">
              <template #value="slotProps">
                <figure v-if="slotProps.value">
                  <img class="rounded-image" :src="slotProps.value.companyLogoLink">
                  <figcaption>{{ slotProps.value.companyName }}</figcaption>
                </figure>
                <p v-else>{{ slotProps.placeholder }}</p>
              </template>
              <template #option="slotProps">
                <figure>
                  <img class="rounded-image" :src="slotProps.option.companyLogoLink">
                  <figcaption>{{ slotProps.option.companyName }}</figcaption>
                </figure>
              </template>
            </Dropdown>
          </div>
          <div class="p-field p-col-12">
            <label for="title">Title</label>
            <InputText id="title" name="title" v-model="dialog.job.title" required />
          </div>
          <div class="p-field p-col-12">
            <label for="description">Description</label>
            <Textarea id="description" name="description" v-model="dialog.job.description" :autoResize="true" required />
          </div>
          <div class="p-field p-col-2">
            <label for="state">State</label>
            <InputText id="state" name="state" v-model="dialog.job.state" required />
          </div>
          <div class="p-field p-col-10">
            <label for="city">City</label>
            <InputText id="city" name="city" v-model="dialog.job.city" required />
          </div>
          <div class="field p-col-6">
            <label>Type</label>
            <div class="p-field-radiobutton p-mt-2">
              <RadioButton id="isRemoteTrue" name="isRemote" :value="true" v-model="dialog.job.isRemote" />
              <label for="isRemote">Remote</label>
            </div>
            <div class="p-field-radiobutton">
              <RadioButton id="isRemoteFalse" name="isRemote" :value="false" v-model="dialog.job.isRemote" />
              <label for="isRemoteFalse">Presential</label>
            </div>
          </div>
        </div>
        <div class="p-text-right">
        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-mr-3" @click="closeCreateDialog()"/>
        <Button label="Create" icon="pi pi-check" class="p-button-success" type="submit" />
        </div>
      </form>
    </Dialog>
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue } from 'vue-class-component'
import { clone, get, isEmpty, set, cloneDeep, unset } from 'lodash'
import { formatISO } from 'date-fns'
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

   contractors = computed(() => this.store.state.fetchedContractors.contractors)

   page = 1
   limit = 5

  limitOptions = [
    { value: 5 },
    { value: 10 },
    { value: 15 },
    { value: 20 }
  ]

   dialog = {
     isCreateOpen: false,
     isEditOpen: false,
     isDeleteOpen: false,
     job: {} as Job
   }

   async fetchJobs () {
     const paginationParams = { page: this.page, limit: this.limit }
     await this.store.dispatch(ActionTypes.FetchJobs, paginationParams)
   }

   async fetchContractors () {
     await this.store.dispatch(ActionTypes.FetchContractors)
   }

   async mounted () {
     await this.fetchJobs()
     await this.fetchContractors()
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

   closeDeleteDialog () {
     this.dialog.isDeleteOpen = false
   }

   async deleteJob (id: string) {
     try {
       await this.store.dispatch(ActionTypes.DeleteJob, { id })
     } catch (error) {
       console.log(error)
     } finally {
       this.closeDeleteDialog()
     }
   }

   openCreateDialog () {
     set(this.dialog, 'job.publishingDate', formatISO(new Date(), { representation: 'date' }))
     set(this.dialog, 'job.isOpen', true)
     set(this.dialog, 'job.isRemote', true)

     this.dialog.isCreateOpen = true
   }

   closeCreateDialog () {
     this.dialog.isCreateOpen = false
   }

   async createJob () {
     const contractor = get(this.dialog.job, 'contractor')

     const IS_JOB_EMPTY = isEmpty(this.dialog.job)
     const IS_CONTRACTOR_EMPTY = isEmpty(contractor)
     if (IS_JOB_EMPTY || IS_CONTRACTOR_EMPTY) return

     const jobToSubmit = cloneDeep(this.dialog.job)
     const contractorId = get(jobToSubmit, 'contractor.id', '')
     set(jobToSubmit, 'contractorId', contractorId)
     unset(jobToSubmit, 'contractor')

     console.log(jobToSubmit)

     // this.closeCreateDialog()
   }
}
</script>

<style lang="scss" scoped>
  .rounded-image {
    border-radius: 50%;

    height: 48px;
    widows: 48px;
  }
</style>
