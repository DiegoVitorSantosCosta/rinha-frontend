import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  constructor() {

  }
  ngAfterViewInit(): void {


  }
  @ViewChild('json') json!: ElementRef;
  resetarVariaveis = () => {
    this.json.nativeElement.value = '';
    this.countEl = 0;
    this.texto = '';
    this.jsonComplet = '';

  }
  processarArquivo = (elemento: any) => {
    this.resetarVariaveis();
    const arquivo = elemento.target.files[0];
    const megaByteAserBaixados: number = 504; // Tamanho da parte a ser lida de cada vez (ajuste conforme necessário)

    const reader = new FileReader();
    let quantidadeBaixadaDoArquivo = 0;
    let jsonEmString = '';
    let pilha: any[] = []; // Pilha para rastrear aberturas

    reader.onload = (event: any) => {

      let parteBaixadaDoJson = (event.target.result);

      let arrayDeCaracteres = parteBaixadaDoJson.replace(/\n/g, '').replace(/\s/g, '').split('');

      let fechamentoPendente = ''; // Variável para armazenar o fechamento pendente

      const processarCaractere = (caractere: string) => {
        jsonEmString += caractere;
        try {
          this.jsonComplet = JSON.parse(jsonEmString + pilha.join(' '))

          let el = this.json.nativeElement
          this.criarJson(el, this.jsonComplet);
          // pilha.pop()

        } catch (error) {

        }

        if (caractere === '{') {

          pilha.push('}');
        } else if (caractere === '[') {
          pilha.push(']');
        } else if (caractere === '}' || caractere === ']') {

          if (pilha.length === 0) {
            fechamentoPendente += caractere; // Armazena o fechamento pendente
          } else {
            const ultimoAbertura = pilha.pop();
            if (caractere !== ultimoAbertura) {
              return false; // O fechamento não corresponde à última abertura
            }
          }
        }

        if (pilha.length === 0 && jsonEmString.trim() !== '' && (caractere === '}' || caractere == ']')) {
          // Se a pilha estiver vazia, a parte é completa
          let parteJSON = jsonEmString + pilha.join('');
          try {
            JSON.parse(parteJSON);
          } catch (error) {
            console.log(error);
            return;
          }
          // jsonEmString = '';

          // Verifica se há um fechamento pendente e remove se houver
          if (fechamentoPendente !== '') {
            parteJSON += fechamentoPendente;
            fechamentoPendente = '';
            debugger
          }

        }

        return true;
      }


      arrayDeCaracteres.forEach((el: any) => {
        processarCaractere(el)
      })

      const el: HTMLElement = this.json.nativeElement;

      quantidadeBaixadaDoArquivo += event.target.result.length;

      // Verifica se há mais dados para ler
      if (quantidadeBaixadaDoArquivo < arquivo.size) {
        const nextChunk = arquivo.slice(quantidadeBaixadaDoArquivo, quantidadeBaixadaDoArquivo + megaByteAserBaixados);
        reader.readAsText(nextChunk);
      } else {
        const js = JSON.stringify(this.jsonComplet)
        console.log(JSON.parse(js))
      }
    };
    // reader.readAsText(arquivo);

    // Inicia a leitura da primeira parte
    const initialChunk = arquivo.slice(0, megaByteAserBaixados);
    reader.readAsText(initialChunk);



  }

  // processarArquivo(elemento: any) {
  //   const file = elemento.target.files[0];
  //   const chunkSize: number = 1; // Tamanho da parte a ser lida de cada vez (ajuste conforme necessário)

  //   const reader = new FileReader();
  //   let offset = 0;
  //   let parteJSON = ''; // Variável para acumular a parte do JSON
  //   let fechamentoPendente = ''; // Variável para armazenar o fechamento pendente

  //   reader.onload = (event: any) => {
  //     parteJSON += event.target.result;

  //     if (fechamentoPendente) {
  //       parteJSON = fechamentoPendente + parteJSON;
  //       fechamentoPendente = '';
  //     }

  //     // Verifica se a parte atual começa com '{'
  //     if (parteJSON.trim().startsWith('{')) {
  //       let pilha = [];
  //       for (const caractere of parteJSON) {
  //         if (caractere === '{') {
  //           pilha.push('}');
  //         } else if (caractere === '}') {
  //           if (pilha.length === 0) {
  //             fechamentoPendente = '}';
  //             break; // A parte ainda não está completa
  //           } else {
  //             pilha.pop();
  //           }
  //         }
  //       }

  //       if (pilha.length === 0) {
  //         // A parte é completa e válida
  //         this.processarParteJSON(parteJSON);
  //         parteJSON = ''; // Limpa a parte para a próxima
  //       }
  //     }

  //     offset += event.target.result.length;

  //     // Verifica se há mais dados para ler
  //     if (offset < file.size) {
  //       const nextChunk = file.slice(offset, offset + chunkSize);
  //       reader.readAsText(nextChunk);
  //     }
  //   };

  //   // Inicia a leitura da primeira parte
  //   const initialChunk = file.slice(0, chunkSize);
  //   reader.readAsText(initialChunk);
  // }

  // Função de exemplo para processar a parte JSON válida
  processarParteJSON = (parteJSON: any) => {
    console.log("Parte JSON válida:");
    console.log(parteJSON);
  }

  texto!: string

  title = 'rinha_front';
  countEl: any = 0;
  jsonComplet!: string;

  criarJson(elemento: HTMLElement, json: any, classe: string = '', i = 0) {
    this.countEl++
    const existeUl = document.querySelector('.ul-' + i + classe)
    const ul = existeUl ? existeUl : document.createElement("ul") as any
    ul.className = 'ul-' + i + classe;
    ul.style.display = 'block';
    elemento.appendChild(ul);

    if (Array.isArray(json) || typeof json === 'object') {
      for (const key in json) {
        const existeLi = document.querySelector('.li-' + i + classe)
        const li = existeLi ? existeLi : document.createElement("li") as any;
        li.className = 'li-' + i + classe;
        ul.appendChild(li);
        const classPrefix = `span${i}`;
        const elementClass = `${classPrefix}-${classe}`;
        const existingElement = document.querySelector(`.${elementClass}`) as HTMLElement;
        const keySpan = existingElement ? existingElement : document.createElement("span") as any
        keySpan.innerText = key + ": ";
        keySpan.className = "json-key font-inter " + elementClass;
        li.appendChild(keySpan);


        if (existingElement) {
          if (Array.isArray(json[key]) || typeof json[key] === 'object') {
            // Se for um objeto ou array, chame recursivamente a função
            this.criarJson(existingElement, json[key], this.countEl, i);
          } else {
            // Trate objetos como JSON formatado
            // existingElement.innerText = `${key}: ${JSON.stringify(json[key])}`;
          }
        } else {
          // const element = document.createElement("span");
          // element.classList.add(elementClass);
          if (Array.isArray(json[key]) || typeof json[key] === 'object') {
            if (i > 0)
              // Se for um objeto ou array, chame recursivamente a função
              this.criarJson(li, json[key], this.countEl, i);

            // element.innerText = `${key}: ${JSON.stringify(json[key])}`;
          } else {
            // element.innerText = `${key}: ${typeof json[key] === "string" ? `"${json[key]}"` : json[key]}`;
            // console.log(element.innerText);

            const valueSpan = document.createElement("span");
            valueSpan.className = "json-value"
            valueSpan.innerText = typeof json[key] === "string" ? `"${json[key]}"` : json[key];
            li.appendChild(valueSpan);
          }
          // elemento.appendChild(element);
        }

        i++;
      }
    }
  }





  // criarJson(elemento: HTMLElement, json: any, isStartOfArray = true) {
  //   const ul = document.createElement("ul");
  //   ul.style.display = 'block';
  //   elemento.appendChild(ul);

  //   for (const key in json) {
  //     const li = document.createElement("li");
  //     ul.appendChild(li);

  //     const keySpan = document.createElement("span");
  //     keySpan.innerText = key + ": ";
  //     keySpan.className = "json-key font-inter";
  //     li.appendChild(keySpan);

  //     if (Array.isArray(json[key]) || typeof json[key] === 'object') {
  //       this.criarJson(li, json[key]);
  //     } else {
  //       const valueSpan = document.createElement("span");
  //       valueSpan.innerText = typeof json[key] === "string" ? `"${json[key]}"` : json[key];
  //       li.appendChild(valueSpan);
  //     }
  //   }
  // }




  toggleJSONView(event: any) {
    const target = event.target;

    const nextElement = target.parentElement.querySelector("ul");
    if (nextElement) {

      if (nextElement.style.display === "none" || nextElement.style.display === "") {
        nextElement.style.display = "block";
      } else {
        nextElement.style.display = "none";
      }
    }

  }

}
