export class LoadingManager{
    button: HTMLButtonElement;
    originalText: string;
    isLoading: boolean;
    constructor(button: HTMLButtonElement){
        this.button = button,
        this.originalText = button.querySelector(".btn-text")?.textContent || button.textContent
        this.isLoading = false
    }

    start(loadingText = "Esta Carregando"){
        if(this.isLoading) return

        this.isLoading = true
        this.button.disabled = true
        this.button.classList.add("btn-loading");

        const spinner = this.button.querySelector(".spinner-border")

        if(spinner){
            spinner.classList.remove("d-none");
        }

        const textElement = this.button.querySelector(".btn-text")
        if(textElement){
            textElement.textContent = loadingText
        }
    }

    stop(){
        if(!this.isLoading) return

        this.isLoading = false;
        this.button.disabled = false;
        this.button.classList.remove('btn-loading');
        
        const spinner = this.button.querySelector('.spinner-border');
        if (spinner) {
          spinner.classList.add('d-none');
        }
        
        const textElement = this.button.querySelector('.btn-text');
        if (textElement) {
          textElement.textContent = this.originalText;
        }
    }
}