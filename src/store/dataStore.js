import { defineStore } from "pinia"
import { db } from '../config/firebaseConfig'
import { collection, getDocs, where, and, query } from 'firebase/firestore'

const useDataStore = defineStore('dataStore', {
    state: () => ({
        reservations: [],
        rejectedReservations: [],
        completedReservations: [],
        canceledReservations: [],
        fetching: false,
        services: [],
        fetchingServices: false,
        availableEmployees: [],
    }),
    actions: {
        async getAvailalableEmployees(){
            try {
                const q = query(
                    collection(db, 'users'),
                    and(
                        where('isAccepted', '==', true),
                        where('role', '==', 'employee'),
                        where('status', '==', 'available'),
                    )
                )
        
                const snapshots = await getDocs(q)
        
                snapshots.docs.forEach(doc => {
                    this.availableEmployees.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            } catch (error) {
                console.log(error)
            }
        },
        async getReservations(){
            const reservationRef = collection(db, 'reservations')
            try {
                this.fetching = true
                const snapshots = await getDocs(reservationRef)
                
                snapshots.docs.forEach(doc => {
                    this.reservations.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            } catch (error) {
                console.log(error)
            } finally {
                this.fetching = false
            }
        },
        async getServices(){
            const servicesCollection = collection(db, 'services')
            try {
                this.fetchingServices = true
                const snapshots = await getDocs(servicesCollection)
                
                snapshots.docs.forEach(doc => {
                    this.services.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })

                this.getRejectedReservations()
                this.getCompletedReservations()
                this.getRejectedReservations()
            } catch (error) {
                console.log(error)
            } finally {
                this.fetchingServices = false
            }
        },
        getServiceDetails(serviceID){
            return this.services.find(service => service.id === serviceID)
        },
        getRejectedReservations(){
            this.rejectedReservations =  this.reservations.filter(reservation => reservation.status === 'rejected')
        },
        getCompletedReservations(){
            this.completedReservations =  this.reservations.filter(reservation => reservation.status === 'completed')
        },
        getCanceledReservations(){
            this.canceledReservations =  this.reservations.filter(reservation => reservation.status === 'canceled')
        },
    },
    getters: {
        pendingReservations: (state) => state.reservations.filter(reservation => reservation.status === 'pending'),
    }
})

export default useDataStore