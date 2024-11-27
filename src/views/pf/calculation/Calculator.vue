<template>
    <v-container>
        <v-card>
            <!-- <v-card-title>
                <span class="text-h5">Manual EPS Calculation</span>
            </v-card-title> -->

            <v-row class="ma-4 pa-0">
                <v-col cols="6">
                    <!-- <v-card> -->
                    <v-form ref="form">
                        <v-card-title>
                            <span class="text-h6">Allocation Surplus Bonus Calculation Form</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Establishment Name" v-model="establishmentName"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Fiscal Year" v-model="fiscalYear"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Gross Profit for the year"
                                            v-model="grossProfit"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Depreciation admissible"
                                            v-model="depreciationAdmissible"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Direct taxes payable for the year" v-model="directTax"
                                            required></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                        <v-text-field label="Development rebate or investment allowance or
                                                                    development allowance" v-model="taxAmount"
                                            required></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Sum Specified In third Schedule" v-model="dividendPayable"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col style="margin-top: 1.1rem;" cols="12" sm="6" md="6">
                                        <v-select :items="CompanyCategory" item-value="id" item-text="category"
                                            label="Select Category" v-model="selectedCategory" dense></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Carry Forward (set on/ set off)" v-model="carryForward"
                                            persistent-hint
                                            hint="Set-on / Set-off Carried forward allowed up to 3 subsequent FY"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="6">
                                        <v-text-field label="Bonus Paid In This FY" v-model="payableBonus" persistent-hint
                                            required></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click.native="reset()">
                                Reset
                            </v-btn>
                            <v-btn color="primary" variant="text" @click.native="calculate()">
                                Generate Excel
                            </v-btn>
                            <v-btn color="primary" variant="text" @click.native="getFomrA()">
                                Form A
                            </v-btn>
                            <v-btn color="primary" variant="text" @click.native="getFomrB()">
                                Form B
                            </v-btn>
                        </v-card-actions>
                        <!-- </v-card> -->
                    </v-form>
                </v-col>
                <v-col cols="6">
                    <v-card>
                        <v-card-title>
                            <span class="text-h6">Allocation Surplus Bonus Calculation Result</span>
                        </v-card-title>
                        <v-simple-table>
                            <template>
                                <tbody>
                                    <tr>
                                        <td>Total Deduction : </td>
                                        <td>{{ totalDed }}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Available Surplus :
                                        </td>
                                        <td>
                                            {{ availableSurplus }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Allocable Surplus :
                                        </td>
                                        <td>
                                            {{ allocableSurplus }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Total Allocable bonus :</td>
                                        <td>{{ totalAllocableBonus }}</td>
                                    </tr>
                                    <tr>
                                        <td>Amount of Set-on or Set-off - FY :</td>
                                        <td>{{ setOnOff }}</td>
                                    </tr>
                                    <tr>
                                        <td>Total set-on or set-off carried forward :</td>
                                        <td>{{ carriedForward }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                    <v-card style="margin-top: 20px;" cols="12">
                        <v-card-title>
                            <span class="text-h6">Disclaimer</span>
                        </v-card-title>
                        <v-card-text >
                            <h5 style="color:red"> Available Surplus : {{ selectedCategory === 1 ? "60%" : selectedCategory
                                === 2 ? "67%" : "" }}</h5>
                            <h5 style="color:red"> Calculation is totally babsed on the inputs given by the user</h5>
                            <h5 style="color:red"> Set-on / Set-off Carried forward allowed up to 3 subsequent FY</h5>
                            <h5 style="color:red"> No data is stored on this system</h5>
                        </v-card-text>
                        <!-- <v-simple-table>
                        </v-simple-table> -->
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
    </v-container>
</template>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.3/moment-with-locales.min.js"
integrity="sha512-vFABRuf5oGUaztndx4KoAEUVQnOvAIFs59y4tO0DILGWhQiFnFHiR+ZJfxLDyJlXgeut9Z07Svuvm+1Jv89w5g=="
crossorigin="anonymous" referrerpolicy="no-referrer"></script> -->
<script>

import fileDownload from 'js-file-download'
// import moment from 'moment'

export default {
    name: "CalculatorVue",
    data() {
        return {
            establishmentName: '',
            payableBonus: 0,
            dividendPayable: 0,
            month: 0,
            tenure: 0,
            fiscalYear: '',
            grossProfit: 0,
            depreciationAdmissible: 0,
            directTax: 0,
            taxAmount: 0,
            // availableSurplus: null,
            // allocableSurplus: null,
            // totalAllocableBonus: null,
            // setOnOff: null,
            // carriedForward: null,
            loading: true,
            downloading: false,
            downloadingError: false,
            CompanyCategory: [
                {
                    id: 1,
                    category: "Indian Company"
                },
                {
                    id: 2,
                    category: "Non-Indian Company"
                }
            ],
            selectedCategory: '',
            carryForward: 0,
            totalDeduction: ''
        }
    },
    watch: {
    },
    methods: {
        calculate() {

            var data = {
                establishmentName: this.establishmentName,
                fiscalYear: this.fiscalYear,
                grossProfit: this.grossProfit.toString(),
                depreciationAdmissible: this.depreciationAdmissible.toString(),
                directTax: this.directTax.toString(),
                taxAmount: this.taxAmount.toString(),
                dividendPayable: this.dividendPayable.toString(),
                interest: this.selectedCategory === 1 ? "60" : this.selectedCategory === 2 ? "67" : "0",
                carryForward: this.carryForward.toString(),
                payableBonus: this.payableBonus.toString(),
                totalDeduction: this.totalDed.toString(),
                availableSurplus: this.availableSurplus.toString(),
                allocableSurplus: this.allocableSurplus.toString(),
                totalAllocableBonus: this.totalAllocableBonus.toString(),
                setOnOff: this.setOnOff.toString(),
                carriedForward: this.setOnOff.toString(),
                sr: "1"
            }
            console.log(data)

            this.$store.dispatch("CalculationModule/getExcel", data
            )
                .then(response => {
                    console.log(response)
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    this.downloadingSheet = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getFomrA() {

            var data = {
                establishmentName: this.establishmentName,
                fiscalYear: this.fiscalYear,
                grossProfit: this.grossProfit.toString(),
                depreciationAdmissible: this.depreciationAdmissible.toString(),
                directTax: this.directTax.toString(),
                taxAmount: this.taxAmount.toString(),
                dividendPayable: this.dividendPayable.toString(),
                interest: this.selectedCategory === 1 ? "60" : "67",
                carryForward: this.carryForward.toString(),
                payableBonus: this.payableBonus.toString(),
                totalDeduction: this.totalDed.toString(),
                availableSurplus: this.availableSurplus.toString(),
                allocableSurplus: this.allocableSurplus.toString(),
                totalAllocableBonus: this.totalAllocableBonus.toString(),
                setOnOff: this.setOnOff.toString(),
                carriedForward: this.setOnOff.toString(),
                sr: "1"
            }
            console.log(data)

            this.$store.dispatch("CalculationModule/getFomrA", data
            )
                .then(response => {
                    console.log(response)
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    this.downloadingSheet = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getFomrB() {

            var data = {
                establishmentName: this.establishmentName,
                fiscalYear: this.fiscalYear,
                grossProfit: this.grossProfit.toString(),
                depreciationAdmissible: this.depreciationAdmissible.toString(),
                directTax: this.directTax.toString(),
                taxAmount: this.taxAmount.toString(),
                dividendPayable: this.dividendPayable.toString(),
                interest: this.selectedCategory === 1 ? "60" : "67",
                carryForward: this.carryForward.toString(),
                payableBonus: this.payableBonus.toString(),
                totalDeduction: this.totalDed.toString(),
                availableSurplus: this.availableSurplus.toString(),
                allocableSurplus: this.allocableSurplus.toString(),
                totalAllocableBonus: this.totalAllocableBonus.toString(),
                setOnOff: this.setOnOff.toString(),
                carriedForward: this.setOnOff.toString(),
                sr: "1"
            }
            console.log(data)

            this.$store.dispatch("CalculationModule/getFomrB", data
            )
                .then(response => {
                    console.log(response)
                    let fileName = response.headers["x-suggested-filename"]
                    fileDownload(response.data, fileName)
                    this.downloadingSheet = false
                    // this.selectPaymentDateDialog = false
                })
                .catch(error => {
                    console.log(error)
                })
        },
        reset() {
            this.$refs.form.reset()
        },
        download(fileName) {
            this.$store.dispatch("employeeModule/downloadEmployeeReport", fileName)
                .then(response => {
                    fileDownload(response.data, fileName)
                    this.downloading = false
                    this.dialog = false
                    this.selectedUnitCodes = []
                    this.dates = []
                    this.selectedContributionStatusList = []
                })
                .catch(error => {
                    console.log(error)
                })
        }
    },
    computed: {
        totalDed() {
            return parseFloat(this.depreciationAdmissible) + parseFloat(this.taxAmount) + parseFloat(this.directTax) + parseFloat(this.dividendPayable);
        },
        availableSurplus() {
            return parseFloat(this.grossProfit - this.totalDed)
        },
        allocableSurplus() {
            if (this.selectedCategory !== null || this.selectedCategory !== undefined) {
                if (this.selectedCategory === 1) {
                    return (this.availableSurplus / 100) * 60;
                }
                if (this.selectedCategory === 2) {
                    return (this.availableSurplus / 100) * 67;
                }

            }
            return 0;
        },
        totalAllocableBonus() {
            return this.allocableSurplus - this.carryForward;
        },
        setOnOff() {
            return this.totalAllocableBonus - this.payableBonus
        },
        carriedForward() {
            return this.setOnOff
        }
    },
    mounted() {
        this.loading = false
    }

}




</script>
  
<style scoped>
a {
    color: #000;
}
</style>