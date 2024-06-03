import { ChatYandexGPT, YandexGPTInputs } from '@langchain/yandex'
import { BaseCache } from '@langchain/core/caches'
import { BaseChatModelParams } from '@langchain/core/language_models/chat_models'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'

class ChatYandexGPT_ChatModels implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'ChatYandexGPT'
        this.name = 'chatYandexGPT'
        this.version = 5.0
        this.type = 'ChatYandexGPT'
        this.icon = 'YandexGPT.svg'
        this.category = 'Chat Models'
        this.description = 'Wrapper around YandexGPT large language models that use the Chat endpoint'
        this.baseClasses = [this.type, ...getBaseClasses(ChatYandexGPT)]
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['yandexApi']
        }
        this.inputs = [
            {
                label: 'Cache',
                name: 'cache',
                type: 'BaseCache',
                optional: true
            },
            {
                label: 'Model Name',
                name: 'modelName',
                type: 'options',
                options: [
                    {
                        label: 'yandexgpt',
                        name: 'yandexgpt'
                    },
                    {
                        label: 'yandexgpt-lite',
                        name: 'yandexgpt-lite'
                    },
                    {
                        label: 'summarization',
                        name: 'summarization'
                    }
                ],
                default: 'yandexgpt',
                optional: true
            },
            {
                label: 'Model version',
                name: 'modelVersion',
                type: 'string',
                default: 'latest'
            },
            {
                label: 'Temperature',
                name: 'temperature',
                type: 'number',
                step: 0.1,
                default: 0.7,
                optional: true
            },
            {
                label: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                step: 1,
                optional: true,
                additionalParams: true
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const temperature = nodeData.inputs?.temperature as string
        const modelName = nodeData.inputs?.modelName as string
        const modelVersion = nodeData.inputs?.modelVersion as string
        const maxTokens = nodeData.inputs?.maxTokens as string

        if (nodeData.inputs?.credentialId) {
            nodeData.credential = nodeData.inputs?.credentialId
        }

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('yandexApiKey', credentialData, nodeData)
        const folderID = getCredentialParam('yandexFolderId', credentialData, nodeData)

        const cache = nodeData.inputs?.cache as BaseCache

        const obj: Partial<YandexGPTInputs> & BaseChatModelParams = {
            temperature: parseFloat(temperature),
            model: modelName,
            apiKey,
            modelVersion,
            folderID
        }

        if (maxTokens) obj.maxTokens = parseInt(maxTokens, 10)

        if (cache) obj.cache = cache

        // eslint-disable-next-line no-console
        console.log('ChatYandexGPT_ChatModels', obj)
        const model = new ChatYandexGPT(obj)
        return model
    }
}

module.exports = { nodeClass: ChatYandexGPT_ChatModels }
