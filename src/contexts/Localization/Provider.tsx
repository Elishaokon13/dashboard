import React, { createContext, useCallback } from 'react'
import { Language } from 'uikit'
import { ContextApi, TranslateFunction } from './types'

// limitless: since we dont do translate but might be doing it later, this file will serve as a empty template
export const LanguageContext = createContext<ContextApi>(undefined)

const setLanguage = (language: Language) => {
  // do nothing
}

const defaultLanguage = { locale: 'en-US', language: 'English', code: 'en' }

export const LanguageProvider: React.FC = ({ children }) => {
  // serve as a storage to reduce extra computation
  const computedTxtRef = React.useRef<{ [t: string]: string }>({})
  const translate: TranslateFunction = useCallback((key, data) => {
    const computedTxt = computedTxtRef.current
    const translatedText = key

    // Check the existence of at least one combination of %%, separated by 1 or more non space characters
    const includesVariable = translatedText.match(/%\S+?%/gm)

    if (includesVariable && data) {
      const dataKeys = Object.keys(data)

      const ckey = `${key}-${dataKeys.map((k) => data[k]).join()}`
      if (ckey in computedTxt) {
        return computedTxt[ckey]
      }

      let interpolatedText = translatedText
      dataKeys.forEach((dataKey) => {
        const templateKey = new RegExp(`%${dataKey}%`, 'g')
        interpolatedText = interpolatedText.replace(templateKey, String(data[dataKey]))
      })

      computedTxt[ckey] = interpolatedText

      return interpolatedText
    }

    return translatedText
  }, [])

  return (
    <LanguageContext.Provider
      value={{ setLanguage, t: translate, isFetching: false, currentLanguage: defaultLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
