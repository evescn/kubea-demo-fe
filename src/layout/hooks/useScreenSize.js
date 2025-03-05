import { useMediaQuery } from '@vueuse/core'

function useScreenSize() {
    const isSmallScreen = useMediaQuery('(max-width: 768px)')
    return { isSmallScreen }
}

export default useScreenSize
