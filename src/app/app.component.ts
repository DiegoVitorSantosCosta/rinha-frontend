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
  processarArquivo = (elemento: any) => {

    // let texto!: string;
    const file = elemento.target.files[0];
    const chunkSize: number = 504; // Tamanho da parte a ser lida de cada vez (ajuste conforme necessário)

    const reader = new FileReader();
    let offset = 0;
    let texto = ''
    let jsonString = '';
    let pilha: any[] = []; // Pilha para rastrear aberturas

    reader.onload = (event: any) => {
      // Aqui você pode processar os dados da parte lida, por exemplo, exibi-los no front-end ou enviá-los ao servidor.
      texto = (event.target.result);
      let arr = texto.replace(/\n/g, '').replace(/\s/g, '').split('');
      // Variável para acumular a string JSON
      let fechamentoPendente = ''; // Variável para armazenar o fechamento pendente

      const processarCaractere = (caractere: string) => {
        jsonString += caractere;
        try {
          let json = JSON.parse(jsonString + pilha.join(' '))
          let el = this.json.nativeElement
          this.criarJson(el, json);
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

        if (pilha.length === 0 && jsonString.trim() !== '') {
          // Se a pilha estiver vazia, a parte é completa
          let parteJSON = jsonString;
          jsonString = '';
          // Verifica se há um fechamento pendente e remove se houver
          if (fechamentoPendente !== '') {
            parteJSON += fechamentoPendente;
            fechamentoPendente = '';
          }

        }

        return true;
      }


      arr.forEach(el => {
        processarCaractere(el)
      })


      // Exemplo de uso:
      // const dados = ['{ "nome": "João", "idade": 30,', ' "casado": false } [1, 2, {', ' "key": "value" } ]'];


      const el: HTMLElement = this.json.nativeElement;
      // this.criarJson(el, JSON.parse(texto));
      // const validaFormatoObjeto = (jsonString: string) => {

      //   arr = jsonString.replace(/\n/g, '').replace(/\s/g, '').split('');
      //   console.log(arr)
      //   const validaEstruturaJSON = (arrayDeCaracteres: any[]) => {
      //     const stack: any = [];
      //     const aberturas = ["{", "["];
      //     const fechamentos = ["}", "]"];
      //     let parteRemovida = '';

      //     for (let i = 0; i < arrayDeCaracteres.length; i++) {
      //       const caractere = arrayDeCaracteres[i];

      //       if (aberturas.includes(caractere)) {
      //         // Se for um caractere de abertura, empilhe-o na pilha
      //         stack.push(caractere);
      //       } else if (fechamentos.includes(caractere)) {
      //         // Se for um caractere de fechamento, verifique se ele corresponde ao último caractere na pilha
      //         const ultimoAberto = stack.pop();
      //         if (!ultimoAberto || aberturas.indexOf(ultimoAberto) !== fechamentos.indexOf(caractere)) {
      //           return false; // O fechamento não corresponde ao último caractere de abertura
      //         }

      //         // Se a pilha ficar vazia, todos os pares foram fechados corretamente
      //         if (stack.length === 0) {
      //           // Remova a parte fechada do array
      //           parteRemovida = arrayDeCaracteres.splice(0, i + 1).join('');
      //           break;
      //         }
      //       }
      //     }

      //     return parteRemovida;
      //   }



      //   const parteRemovida = validaEstruturaJSON(arr);

      //   if (parteRemovida) {
      //     console.log("Parte removida da estrutura JSON:");
      //     console.log(parteRemovida);
      //   } else {
      //     console.log("A estrutura JSON não é válida.");
      //   }

      //   // Verifica se a string começa com '{' e termina com '}'
      //   // if (jsonString[0] === '{') {

      //   //   jsonString = jsonString.slice(1, -1);

      //   //   // Divide a string em pares chave-valor
      //   //   const pares = jsonString.split(",");
      //   //   const validaValorJSON = (valor: any) => {
      //   //     // Adicione aqui as validações para diferentes tipos de valores, como strings, números, objetos, etc.
      //   //     // Por enquanto, retornamos true para todos os valores.
      //   //     return true;
      //   //   }
      //   //   // Verifica cada par chave-valor
      //   //   for (const par of pares) {
      //   //     const [chave, valor] = par.split(":");
      //   //     const chaveValida = /^"\w+"$/.test(chave?.trim());
      //   //     const valorValido = validaValorJSON(valor?.trim());

      //   //     if (!chaveValida || !valorValido) {
      //   //       return false;
      //   //     }
      //   //   }

      //   //   return true;
      //   // } else {
      //   //   return false;
      //   // }
      // }

      // const res = validaFormatoObjeto(texto)
      // console.log(res);
      // console.log(texto);
      // reader.readAsText(file);
      // this.tratarTexto(texto);

      offset += event.target.result.length;

      // Verifica se há mais dados para ler
      if (offset < file.size) {
        const nextChunk = file.slice(offset, offset + chunkSize);
        reader.readAsText(nextChunk);
      }
    };
    // reader.readAsText(file);

    // Inicia a leitura da primeira parte
    const initialChunk = file.slice(0, chunkSize);
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

  // lazyLoadJSON(key: string) {
  //   return new Promise((resolve, reject) => {
  //     if (bigJSON.hasOwnProperty(key)) {
  //       resolve(bigJSON[key]);
  //     } else {
  //       reject("Chave não encontrada no JSON.");
  //     }
  //   });
  // }
  tratarTexto = (textoJson: string) => {

    // try {
    //   JSON.parse(textoJson);
    // } catch (e) {
    //   this.tratarError(e)
    //   console.error(e);
    //   return;
    // }

    const arr = textoJson.replace(/\n/g, '').replace(/\s/g, '').split('');
    // console.log(textoJson);
    let encontrouPrimeira = false;

    const newArray = arr.map((letra: string, index: number) => {
      if (letra == '{') {
        arr.splice(index + 1, 0, "<br>");
      }
      if (arr[index - 1] == '"' && letra == ',') {
        arr.splice(index + 1, 0, "<br>");
      }


      if (letra === '"' && !encontrouPrimeira && (arr[index - 2] === '{' || arr[index - 2] === ',')) {
        letra = `<span class='chave font-inter'> `;
        // arr.splice(index - 2, 0, '&nbsp')
        encontrouPrimeira = true;

        if (letra == ':') arr.splice(index, 0, ' ');

      } else if (letra === '"' && encontrouPrimeira) {
        letra = `</span>`
        encontrouPrimeira = false;

      }

      return letra;
    })
    this.texto = newArray.join('')
    console.log(newArray);
    const string = arr.join('');
    // console.log(string);

    // for (const str of arr) {
    //   console.log(str);
    //   for (let i = 0; i < str.length; i++) {
    //     if (str[i] === '"' && !encontrouPrimeira) {
    //       posicao1 = i;
    //       encontrouPrimeira = true;
    //     } else if (str[i] === '"' && encontrouPrimeira) {
    //       encontrouPrimeira = false;
    //       posicao2 = i;
    //       // console.log(arr[posicao1]);
    //       // const novaMatriz = arr.slice(posicao1, i)
    //       // console.log(novaMatriz)
    //       // i += 2; // Ignora as duas aspas duplas seguintes
    //       // console.log(arr[i]);
    //       // console.log(`Encontrou a segunda aspa dupla após a primeira em "${str}"`);
    //     }
    //   }
    // }

    // console.log(arr);
  }

  tratarError = (e: any) => {
    console.error(e);
  }

  title = 'rinha_front';

  countEl: any = 0;
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
            existingElement.innerText = `${key}: ${JSON.stringify(json[key])}`;
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
