import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config-service.service';
import { english_LanguageMap } from './localization/english';
import { italiano_LanguageMap } from './localization/italiano';

const USER_LANGUAGE_KEY : string = "user-language"

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
    
    private languages : string[] = []
    private languageMaps : any = []


    private selectedLanguage : string = localStorage.getItem(USER_LANGUAGE_KEY)
    private loadedLanguageMap : any = []

    constructor(
        private config : ConfigService,
        private http : HttpClient
    ) { 
        // Add language maps
        this.languageMaps["english"] = english_LanguageMap
        this.languageMaps["italiano"] = italiano_LanguageMap

        // Set the loaded language map
        this.loadedLanguageMap = this.languageMaps[this.selectedLanguage]

        // Load the languages array from the language map
        for (let l in this.languageMaps) {
            this.languages.push(l)
        }
    }

    /**
     * Returns the message mapped to the given key for the currently selected language
     */
    public getMessage(key:string) : string {
        return this.loadedLanguageMap[key]
    }

    /**
     * Updates the currently selected language and loads the language content from
     * the remote resources on the server
     */
    public selectLanguage(language : string) {
        this.selectedLanguage = language
        localStorage.setItem(USER_LANGUAGE_KEY, this.selectedLanguage)
        this.loadedLanguageMap = this.languageMaps[language]
    }

    public getLanguages() : string[] {
        return this.languages
    }

    public getSelectedLanguage() : string {
        return this.selectedLanguage
    }
}
