import { ref } from 'vue'

export function useToast() {
    const toast = ref({
        show: false,
        message: '',
        type: 'error'
    })

    let toastTimeout: ReturnType<typeof setTimeout> | null = null

    const showToast = (message: string, type = 'error') => {
        toast.value.message = message
        toast.value.type = type
        toast.value.show = true

        if (toastTimeout) clearTimeout(toastTimeout)
        toastTimeout = setTimeout(() => {
            toast.value.show = false
        }, 5000)
    }

    return {
        toast,
        showToast
    }
}
