"use strict";

import ModelError from "/ModelError.js";
import Veiculo from "/Veiculo.js";

export default class DaoVeiculo {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.array_veiculo = [];
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  async obterConexao() {
    if(DaoVeiculo.conexao == null) {
      DaoVeiculo.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("veic_db", 1); 

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("veic_st", {
            autoIncrement: true
          });
          store.createIndex("idxveic", "cod_veic", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoVeiculo.conexao;
  }
  
  //-----------------------------------------------------------------------------------------//

  async obter_veiculos() {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["veic_st"], "readonly");
        store = transacao.objectStore("veic_st");
        indice = store.index('idxveic');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Veiculo.assign(cursor.value);
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayVeiculos = await promessa;
    return this.arrayVeiculos;
  }

  //-----------------------------------------------------------------------------------------//

  async obter_veiculo_pelo_codigo(cod_veic) {
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["veic_st"], "readonly");
        store = transacao.objectStore("veic_st");
        indice = store.index('idxveic');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(cod_veic);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(veiculo.assign(consulta.result)); 
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let veiculo = await promessa;
    return veiculo;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(veiculo) {
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["veic_st"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o veiculo", event.target.error));
      };
      let store = transacao.objectStore("veic_st");
      let requisicao = store.add(veiculo.deassign(veiculo));
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(veiculo) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["veic_st"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o veiculo", event.target.error));
      };
      let store = transacao.objectStore("veic_st");     
      let indice = store.index('idxveic');
      var keyValue = IDBKeyRange.only(veiculo.getCod_veic());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.cod_veic == veiculo.getCod_veic()) {
            const request = cursor.update(veiculo.deassign(veiculo));
            request.onsuccess = () => {
              console.log("[DaoVeiculo.alterar] Cursor update - Sucesso ");
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Veiculo com o código " + veiculo.getCod_veic() + " não encontrado!",""));
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(veiculo) {
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["veic_st"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o veiculo", event.target.error));
      };
      let store = transacao.objectStore("veic_st");
      let indice = store.index('idxveic');
      var keyValue = IDBKeyRange.only(veiculo.getCod_veic());
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.cod_veic == veiculo.getCod_veic()) {
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Veiculo com o código " + veiculo.getCod_veic()) + " não encontrado!",""));
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}
