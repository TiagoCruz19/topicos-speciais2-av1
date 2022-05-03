"use strict";

import Status from "/Status.js";
import Veiculo from "/Veiculo.js";
import DaoVeiculo from "/DAOVeiculo.js";
import VeiculoViewer from "/VeiculoViewer.js";

export default class CtrlManterVeiculos {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Servico
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Aluno que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DAOVeiculo();
    this.#viewer = new VeiculoViewer(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conj_veic = await this.#dao.obter_veiculos();
    
    // Se a lista de alunos estiver vazia
    if(conj_veic.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conj_veic.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conj_veic.length, conj_veic[this.#posAtual - 1]);
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conj_veic = await this.#dao.obter_veiculos();
    if(conj_veic.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conj_veic = await this.#dao.obter_veiculos();
    if(this.#posAtual < conj_veic.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conj_veic = await this.#dao.obter_veiculos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conj_veic = await this.#dao.obter_veiculos();
    this.#posAtual = conj_veic.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciar_incluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciar_alterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciar_excluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(cod_veic, modelo_veic, desc_veic, valor_veic) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let veiculo = new Veiculo(cod_veic, modelo_veic, desc_veic, valor_veic);
        await this.#dao.incluir(veiculo); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(cod_veic, modelo_veic, desc_veic, valor_veic) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let veiculo = await this.#dao.obter_veiculo_pelo_codigo(cod_veic); 
        if(veiculo == null) {
          alert("Veiculo com o código " + cod_veic + " não encontrado.");
        } else {
          veiculo.setCod_veic(cod_veic);
          veiculo.setModelo_veic(modelo_veic);
          veiculo.setDesc_veic(desc_veic);
          veiculo.setValor_veic(valor_veic);
          await this.#dao.alterar(veiculo); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(cod_veic) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let veiculo = await this.#dao.obter_veiculo_pelo_codigo(cod_veic); 
        if(veiculo == null) {
          alert("Veículo com o código " + cod_veic + " não encontrado.");;
        } else {
          await this.#dao.excluir(veiculo); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}