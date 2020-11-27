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
              <ContractorInfo :name="slotProps.data.contractor.companyName" :logoLink="slotProps.data.contractor.companyLogoLink" />
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
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-warning p-mr-2" @click="openEditDialog(slotProps.data)" />
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
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteJob(dialog.job.id)" />
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
                <ContractorInfo v-if="slotProps.value" :name="slotProps.value.companyName"
                  :logoLink="slotProps.value.companyLogoLink" />
                <p v-else>{{ slotProps.placeholder }}</p>
              </template>
              <template #option="slotProps">
                <ContractorInfo :name="slotProps.option.companyName" :logoLink="slotProps.option.companyLogoLink" />
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
            <InputText id="state" name="state" v-model="dialog.job.state" required maxlength="2" />
          </div>
          <div class="p-field p-col-10">
            <label for="city">City</label>
            <InputText id="city" name="city" v-model="dialog.job.city" required />
          </div>
          <div class="p-field p-col-6">
            <label>Type</label>
            <div class="p-formgroup-inline p-mt-2">
              <div class="p-field-radiobutton">
                <RadioButton id="isRemoteTrue" name="isRemote" :value="true" v-model="dialog.job.isRemote" />
                <label for="isRemote">Remote</label>
              </div>
              <div class="p-field-radiobutton">
                <RadioButton id="isRemoteFalse" name="isRemote" :value="false" v-model="dialog.job.isRemote" />
                <label for="isRemoteFalse">Presential</label>
              </div>
            </div>
          </div>
        </div>
        <div class="p-text-right">
          <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-mr-3" @click="closeCreateDialog()"/>
          <Button label="Create" icon="pi pi-check" class="p-button-success" type="submit" />
        </div>
      </form>
    </Dialog>

    <Dialog :visible="dialog.isEditOpen" :closable="false" header="Edit job" :modal="true" style="min-width: 50%">
      <form @submit.prevent="editJob" class="p-text-left">
        <div class="p-fluid p-formgrid p-grid">
          <div class="p-field p-col-12">
            <label for="contractor">Contractor</label>
            <ContractorInfo :name="dialog.job.contractor.companyName" :logoLink="dialog.job.contractor.companyLogoLink" />
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
            <InputText id="state" name="state" v-model="dialog.job.state" required maxlength="2" />
          </div>
          <div class="p-field p-col-10">
            <label for="city">City</label>
            <InputText id="city" name="city" v-model="dialog.job.city" required />
          </div>
          <div class="p-field p-col-6">
            <label>Type</label>
            <div class="p-formgroup-inline p-mt-2">
              <div class="p-field-radiobutton">
                <RadioButton id="isRemoteTrue" name="isRemote" :value="true" v-model="dialog.job.isRemote" />
                <label for="isRemote">Remote</label>
              </div>
              <div class="p-field-radiobutton">
                <RadioButton id="isRemoteFalse" name="isRemote" :value="false" v-model="dialog.job.isRemote" />
                <label for="isRemoteFalse">Presential</label>
              </div>
            </div>
          </div>
          <div class="p-field p-col-6">
            <label>Status</label>
            <div class="p-formgroup-inline p-mt-2">
              <div class="p-field-radiobutton">
                <RadioButton id="isOpenTrue" name="isOpen" :value="true" v-model="dialog.job.isOpen" />
                <label for="isOpenTrue">Open</label>
              </div>
              <div class="p-field-radiobutton">
                <RadioButton id="isOpenFalse" name="isOpen" :value="false" v-model="dialog.job.isOpen" />
                <label for="isOpenFalse">Closed</label>
              </div>
            </div>
          </div>
          <div class="p-field p-col-3">
            <label for="publishingDate" class="p-d-block">Publishing Date</label>
            <Calendar id="publishingDate" name="publishingDate" v-model="dialog.job.publishingDate" required dateFormat="yy-mm-dd"
              :showIcon="true" :showWeek="true" :showButtonBar="true" :monthNavigator="true" :yearNavigator="true" yearRange="2000:2040" />
          </div>
        </div>
        <div class="p-text-right">
          <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-mr-3" @click="closeEditDialog()"/>
          <Button label="Confirm" icon="pi pi-check" class="p-button-success" type="submit" />
        </div>
      </form>
    </Dialog>
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue, Options } from 'vue-class-component'
import { get, isEmpty, set, cloneDeep, unset } from 'lodash'
import { formatISO } from 'date-fns'
import { useStore } from '@/store'
import { Job } from '@/store/state'
import { ActionTypes } from '@/store/actions'
import ContractorInfo from '@/components/ContractorInfo.vue'

@Options({
  components: {
    ContractorInfo
  }
})
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

   resetDialogJob () {
     set(this.dialog, 'job', {})
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
     this.resetDialogJob()
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

   isJobInvalid (): boolean {
     const contractor = get(this.dialog.job, 'contractor')
     const IS_JOB_EMPTY = isEmpty(this.dialog.job)
     const IS_CONTRACTOR_EMPTY = isEmpty(contractor)

     return IS_JOB_EMPTY || IS_CONTRACTOR_EMPTY
   }

   openCreateDialog () {
     set(this.dialog, 'job.publishingDate', formatISO(new Date(), { representation: 'date' }))
     set(this.dialog, 'job.isOpen', true)
     set(this.dialog, 'job.isRemote', true)

     this.dialog.isCreateOpen = true
   }

   closeCreateDialog () {
     this.dialog.isCreateOpen = false
     this.resetDialogJob()
   }

   async createJob () {
     if (this.isJobInvalid()) return

     const jobToSubmit = cloneDeep(this.dialog.job)
     const contractorId = get(jobToSubmit, 'contractor.id', '')
     set(jobToSubmit, 'contractorId', contractorId)
     unset(jobToSubmit, 'contractor')

     await this.store.dispatch(ActionTypes.CreateJob, jobToSubmit)

     this.closeCreateDialog()
   }

   openEditDialog (job: Job) {
     set(this.dialog, 'job', job)

     this.dialog.isEditOpen = true
   }

   closeEditDialog () {
     this.dialog.isEditOpen = false
     this.resetDialogJob()
   }

   async editJob () {
     if (this.isJobInvalid()) return

     const jobToSubmit = cloneDeep(this.dialog.job)
     unset(jobToSubmit, 'contractor')

     const publishingDate = new Date(get(jobToSubmit, 'publishingDate'))
     const parsedPublishingDate = formatISO(publishingDate, { representation: 'date' })
     set(jobToSubmit, 'publishingDate', parsedPublishingDate)

     await this.store.dispatch(ActionTypes.UpdateJob, jobToSubmit)

     this.closeEditDialog()
   }
}
</script>
