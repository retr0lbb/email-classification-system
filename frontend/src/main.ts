import './style.css'

// Renderizar o HTML
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container my-5">
    <h1 class="text-center mb-4">Sistema de classificação de emails</h1>
    
    <!-- Drop Zone -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Upload de Arquivo</h5>
        <p>Somente arquivos .TXT, .DOCX e .PDF</p>
      </div>
      <div class="card-body">
        <div class="drop-zone" id="dropZone">
          <i class="bi bi-cloud-upload fs-1 text-primary"></i>
          <p class="mt-3 mb-2">Arraste e solte seu arquivo aqui</p>
          <p class="text-muted">ou</p>
          <button type="button" class="btn btn-primary" id="selectFileBtn">
            Selecionar Arquivo
          </button>
          <input type="file" id="fileInput" class="d-none" />
        </div>
        <div id="fileInfo" class="mt-3"></div>
      </div>
    </div>

    <!-- Textarea -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Entrada de Texto</h5>
      </div>
      <div class="card-body">
        <textarea 
          class="form-control" 
          id="textInput" 
          rows="8" 
          placeholder="Digite ou cole seu texto aqui..."></textarea>
        <div class="mt-3">
          <button class="btn btn-success" id="submitBtn">Enviar</button>
          <button class="btn btn-secondary" id="clearBtn">Limpar</button>
        </div>
      </div>
    </div>
  </div>
`

// Elementos do DOM
const dropZone = document.getElementById('dropZone') as HTMLDivElement
const fileInput = document.getElementById('fileInput') as HTMLInputElement
const fileInfo = document.getElementById('fileInfo') as HTMLDivElement
const textInput = document.getElementById('textInput') as HTMLTextAreaElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement
const selectFileBtn = document.getElementById('selectFileBtn') as HTMLButtonElement

const FILE_UPLOAD_ROUTE = '/api/upload-file'
const TEXT_SUBMIT_ROUTE = '/api/submit-text'

const preventDefaults = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
}


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach((eventName: string) => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.add('dragover')
  })
});

['dragleave', 'drop'].forEach((eventName: string) => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.remove('dragover')
  })
});

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Exibir informações do arquivo
const displayFileInfo = (file: File) => {
  fileInfo.innerHTML = `
    <div class="alert alert-success">
      <strong>Arquivo selecionado:</strong> ${file.name} 
      <span class="badge bg-secondary">${formatFileSize(file.size)}</span>
    </div>
  `
}

// Lidar com arquivos
const handleFiles = (files: FileList) => {
  if (files.length > 0) {
    const file = files[0]
    displayFileInfo(file)
  }
}

// Event listeners para upload de arquivo
dropZone.addEventListener('drop', (e: DragEvent) => {
  const dt = e.dataTransfer
  if (dt?.files) {
    handleFiles(dt.files)
  }
})

selectFileBtn.addEventListener('click', () => {
  fileInput.click()
})

fileInput.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files)
  }
})

// Enviar arquivo para rota de upload
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(FILE_UPLOAD_ROUTE, {
      method: 'POST',
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      alert(`Arquivo enviado com sucesso!\nRota: ${FILE_UPLOAD_ROUTE}`)
      console.log('Resposta:', result)
    } else {
      alert('Erro ao enviar arquivo')
    }
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro ao enviar arquivo: ' + error)
  }
}

// Enviar texto para rota de texto
const submitText = async (text: string) => {
  try {
    const response = await fetch(TEXT_SUBMIT_ROUTE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })

    if (response.ok) {
      const result = await response.json()
      alert(`Texto enviado com sucesso!\nRota: ${TEXT_SUBMIT_ROUTE}`)
      console.log('Resposta:', result)
    } else {
      alert('Erro ao enviar texto')
    }
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro ao enviar texto: ' + error)
  }
}

// Botão enviar - lógica condicional
submitBtn.addEventListener('click', async () => {
  const text = textInput.value.trim()
  const file = fileInput.files?.[0]

  // Prioridade: se tem arquivo, envia arquivo (ignora texto)
  if (file) {
    await uploadFile(file)
  } 
  // Se não tem arquivo mas tem texto, envia texto
  else if (text) {
    await submitText(text)
  } 
  // Se não tem nada
  else {
    alert('Por favor, adicione um arquivo ou texto antes de enviar.')
  }
})

// Botão limpar
clearBtn.addEventListener('click', () => {
  textInput.value = ''
  fileInput.value = ''
  fileInfo.innerHTML = ''
})