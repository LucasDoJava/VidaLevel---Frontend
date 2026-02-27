import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

//hook usado para ajudar na busca elastica com o solr
//resumindo: sem ele, varias requisiçoes vao ser feitas a cada tecla pressionada 