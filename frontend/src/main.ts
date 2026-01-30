import './style.css'
import { LoadingManager } from './utils/loading-manager'


// Renderizar o HTML
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container my-5">
    <h1 class="text-center mb-4">Upload de Arquivos e Entrada de Texto</h1>
    
    <!-- Drop Zone -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Upload de Arquivo</h5>
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
          <button id="submitBtn" class="btn btn-primary">
              <span class="btn-text">Enviar</span>
              <span class="spinner-border spinner-border-sm d-none" role="status">
                <span class="visually-hidden">Carregando...</span>
              </span>
            </button>
          <button class="btn btn-secondary" id="clearBtn">Limpar</button>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div class="card mt-4 d-none" id="resultCard">
      <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="bi bi-check-circle-fill me-2"></i>
          Resultado da Análise
        </h5>
        <button type="button" class="btn-close btn-close-white" id="closeResultBtn" aria-label="Fechar"></button>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label class="fw-bold text-muted small">CLASSIFICAÇÃO</label>
          <div id="resultLabel" class="h4 mb-0"></div>
        </div>
        
        <div class="mb-3">
          <label class="fw-bold text-muted small">RESPOSTA SUGERIDA</label>
          <div class="card bg-light">
            <div class="card-body">
              <pre id="resultResponse" class="mb-0 text-wrap" style="white-space: pre-wrap; font-family: inherit;"></pre>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <div>
            <label class="fw-bold text-muted small">TEMPO DE PROCESSAMENTO</label>
            <div id="resultTime" class="text-secondary"></div>
          </div>
          <div>
            <button class="btn btn-outline-primary btn-sm" id="copyResponseBtn">
              <i class="bi bi-clipboard"></i> Copiar Resposta
            </button>
          </div>
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

// Elementos de resultado
const resultCard = document.getElementById('resultCard') as HTMLDivElement
const resultLabel = document.getElementById('resultLabel') as HTMLDivElement
const resultResponse = document.getElementById('resultResponse') as HTMLPreElement
const resultTime = document.getElementById('resultTime') as HTMLDivElement
const closeResultBtn = document.getElementById('closeResultBtn') as HTMLButtonElement
const copyResponseBtn = document.getElementById('copyResponseBtn') as HTMLButtonElement

const loadingButton = new LoadingManager(submitBtn)

const FILE_UPLOAD_ROUTE = `${import.meta.env.VITE_BACKEND_URL}/classify/file`
const TEXT_SUBMIT_ROUTE = `${import.meta.env.VITE_BACKEND_URL}/classify/json`

const preventDefaults = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false)
});

['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.add('dragover')
  })
});

['dragleave', 'drop'].forEach(eventName => {
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

const displayFileInfo = (file: File) => {
  fileInfo.innerHTML = `
    <div class="alert alert-success">
      <strong>Arquivo selecionado:</strong> ${file.name} 
      <span class="badge bg-secondary">${formatFileSize(file.size)}</span>
    </div>
  `
}

const handleFiles = (files: FileList) => {
  if (files.length > 0) {
    const file = files[0]
    displayFileInfo(file)
  }
}

// Função para exibir resultados
interface ApiResponse {
  label: string
  suggested_response: string
  processing_time: string
}

const displayResults = (data: ApiResponse) => {
  // Preenche os dados
  resultLabel.textContent = data.label
  resultResponse.textContent = data.suggested_response
  resultTime.textContent = data.processing_time

  // Adiciona badge colorido baseado no label
  const labelBadge = document.createElement('span')
  labelBadge.className = 'badge ms-2'
  
  if (data.label.toLowerCase() === 'produtivo') {
    labelBadge.classList.add('bg-success')
  } else if (data.label.toLowerCase() === 'improdutivo') {
    labelBadge.classList.add('bg-danger')
  } else {
    labelBadge.classList.add('bg-secondary')
  }
  
  labelBadge.textContent = data.label
  resultLabel.textContent = ''
  resultLabel.appendChild(labelBadge)

  // Mostra o card com animação
  resultCard.classList.remove('d-none')
  resultCard.style.opacity = '0'
  resultCard.style.transform = 'translateY(20px)'
  
  setTimeout(() => {
    resultCard.style.transition = 'all 0.3s ease-in-out'
    resultCard.style.opacity = '1'
    resultCard.style.transform = 'translateY(0)'
  }, 10)

  // Scroll suave até o resultado
  setTimeout(() => {
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, 100)
}

// Função para fechar resultados
const hideResults = () => {
  resultCard.style.opacity = '0'
  resultCard.style.transform = 'translateY(20px)'
  
  setTimeout(() => {
    resultCard.classList.add('d-none')
  }, 300)
}

// Event listeners para resultado
closeResultBtn.addEventListener('click', hideResults)

copyResponseBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultResponse.textContent || '')
    
    // Feedback visual
    const originalText = copyResponseBtn.innerHTML
    copyResponseBtn.innerHTML = '<i class="bi bi-check-lg"></i> Copiado!'
    copyResponseBtn.classList.remove('btn-outline-primary')
    copyResponseBtn.classList.add('btn-success')
    
    setTimeout(() => {
      copyResponseBtn.innerHTML = originalText
      copyResponseBtn.classList.remove('btn-success')
      copyResponseBtn.classList.add('btn-outline-primary')
    }, 2000)
  } catch (error) {
    alert('Erro ao copiar texto')
  }
})

// Drag and drop handlers
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
      displayResults(result)
      console.log('Resposta:', result)
    } else {
      const errorText = await response.text()
      alert(`Erro ao enviar arquivo: ${response.status} - ${errorText}`)
    }
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro ao enviar arquivo: ' + error)
  }
}

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
      displayResults(result)
      console.log('Resposta:', result)
    } else {
      const errorText = await response.text()
      alert(`Erro ao enviar texto: ${response.status} - ${errorText}`)
    }
  } catch (error) {
    console.error('Erro:', error)
    alert('Erro ao enviar texto: ' + error)
  }
}

submitBtn.addEventListener('click', async () => {
  // Esconde resultados anteriores
  hideResults()
  
  loadingButton.start("Processando...")
  const text = textInput.value.trim()
  const file = fileInput.files?.[0]

  try {
    if (file) {
      await uploadFile(file)
    } 
    else if (text) {
      await submitText(text)
    } 
    else {
      alert('Por favor, adicione um arquivo ou texto antes de enviar.')
    }
  } finally {
    loadingButton.stop()
  }
})

clearBtn.addEventListener('click', () => {
  textInput.value = ''
  fileInput.value = ''
  fileInfo.innerHTML = ''
  hideResults()
})