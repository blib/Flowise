import { INodeParams, INodeCredential } from '../src/Interface'

class YandexApi implements INodeCredential {
    label: string
    name: string
    version: number
    inputs: INodeParams[]

    constructor() {
        this.label = 'Yandex API'
        this.name = 'yandexApi'
        this.version = 1.0
        this.inputs = [
            {
                label: 'YandexGPT Api Key',
                name: 'yandexApiKey',
                type: 'password'
            },
            {
                label: 'Yandex Folder ID',
                name: 'yandexFolderId',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: YandexApi }
