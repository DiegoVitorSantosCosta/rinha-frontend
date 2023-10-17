import { Component, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  processarArquivo = (elemento: any) => {

    const file = elemento.target.files[0];
    const chunkSize: number = 1024; // Tamanho da parte a ser lida de cada vez (ajuste conforme necessário)

    const reader: any = new FileReader();
    let offset = 0;

    reader.onload = (event: any) => {
      // Aqui você pode processar os dados da parte lida, por exemplo, exibi-los no front-end ou enviá-los ao servidor.
      const texto = event.target.result;
      console.log(texto);
      // this.tratarTexto(texto);

      offset += event.target.result.length;

      // Verifica se há mais dados para ler
      if (offset < file.size) {
        const nextChunk = file.slice(offset, offset + chunkSize);
        reader.readAsText(nextChunk);
      }
    };

    // Inicia a leitura da primeira parte
    const initialChunk = file.slice(0, chunkSize);
    reader.readAsText(initialChunk);




    return;
    // let arquivo = elemento.target.files[0];
    // if (arquivo?.type !== 'application/json') {
    //   elemento.value = null;
    //   return
    // }

    // const chunkSize = 1024;

    // if (arquivo) {
    //   let reader: any = new FileReader();


    // Inicia a leitura da primeira parte
    // const initialChunk = file.slice(0, chunkSize);
    // reader.readAsText(initialChunk);

    // reader.onload = () => {
    //   // let texto = reader.result as string;
    //   // if (texto) this.tratarTexto(texto);
    //   const chunkData = elemento.target.result;
    //   console.log(chunkData);

    //   if (reader.readyState === 2 && reader.result.length > 0) {
    //     const remainingData = arquivo.slice(reader.result.length);
    //     reader.readAsText(remainingData);
    //   }

    // const chunkData = event.target.result;
    // console.log(chunkData);

    // Verifica se há mais dados para ler

    // const initialChunk = arquivo.slice(0, chunkSize);
    // reader.readAsText(initialChunk);

    // reader.readAsText(arquivo);
    // }
  }
  texto!: string

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


  //    createJSONView(parent, data) {
  //   if (Array.isArray(data) || typeof data === 'object') {
  //     const ul = document.createElement("ul");
  //     parent.appendChild(ul);

  //     for (const key in data) {
  //       const li = document.createElement("li");
  //       ul.appendChild(li);
  //       const keySpan = document.createElement("span");
  //       keySpan.className = "json-key";
  //       keySpan.innerText = key + ": ";
  //       li.appendChild(keySpan);
  //       createJSONView(li, data[key]);
  //     }
  //   } else {
  //     const span = document.createElement("span");
  //     span.innerText = data;
  //     parent.appendChild(span);
  //   }
  // }

  //  toggleJSONView(event) {
  //   const target = event.target;

  //   if (target.classList.contains("json-key")) {
  //     const nextElement = target.parentElement.querySelector("ul");

  //     if (nextElement) {
  //       if (nextElement.style.display === "none" || nextElement.style.display === "") {
  //         nextElement.style.display = "block";
  //       } else {
  //         nextElement.style.display = "none";
  //       }
  //     }
  //   }
  // }

}
