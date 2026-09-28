import { useClientService } from '@opencloud-eu/web-pkg'

export function useFileOperations() {
  const clientService = useClientService()

  async function loadFile(fileUrl: string): Promise<string> {
    const response = await clientService.httpAuthenticated.get<string>(fileUrl, {
      responseType: 'text'
    })
    return response.data
  }

  async function saveFile(fileUrl: string, content: string): Promise<void> {
    await clientService.httpAuthenticated.put(fileUrl, content, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async function createFile(folderUrl: string, fileName: string): Promise<void> {
    const fileUrl = `${folderUrl}/${fileName}`
    const emptyExcalidraw = JSON.stringify({
      type: 'excalidraw',
      version: 2,
      source: 'opencloud-excalidraw',
      elements: [],
      appState: {
        viewBackgroundColor: '#ffffff'
      },
      files: {}
    })
    await saveFile(fileUrl, emptyExcalidraw)
  }

  return {
    loadFile,
    saveFile,
    createFile
  }
}
