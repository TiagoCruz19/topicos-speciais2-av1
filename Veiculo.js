import ModelError from "/ModelError.js";

export default class Veiculo {
  
  #cod_veic;
  #modelo_veic;
  #desc_veic;
  #valor_veic;
  

  //-----------------------------------------------------------------------------------------//

  constructor(cod_veic, modelo_veic, desc_veic, valor_veic) {
    this.setCod_veic(cod_veic);
    this.setModelo_veic(modelo_veic);
    this.setDesc_veic(desc_veic);
    this.setValor_veic(valor_veic);     
  }
  
  //-----------------------------------------------------------------------------------------//

  getCod_veic() {
    return this.#cod_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCod_veic(cod_veic) {
    if(!Veiculo.validar_cod_veiculo(cod_veic))
      throw new ModelError("Veículo Inválido: " + cod_veic);
    this.#cod_veic = cod_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  getModelo_veic() {
    return this.#modelo_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  setModelo_veic(modelo_veic) {
    if(!Veiculo.validar_modelo_veic(modelo_veic))
      throw new ModelError("Modelo Inválido: " + modelo_veic);
    this.#modelo_veic = modelo_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  getDesc_veic() {
    return this.#desc_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  setDesc_veic(desc_veic) {
    if(!Veiculo.validar_desc_veic(desc_veic))
      throw new ModelError("Descrição Inválida: " + desc_veic);
    this.#desc_veic = desc_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  getValor_veic() {
    return this.#valor_veic;
  }
  
  //-----------------------------------------------------------------------------------------//

  setValor_veic(valor_veic) {
    if(!Veiculo.validar_modelo_veic(valor_veic))
      throw new ModelError("Valor inválido: " + valor_veic);
    this.#valor_veic = valor_veic;
  }
  
  //-----------------------------------------------------------------------------------------//
  

  toJSON() {
    return '{' +
               '"codigo do veículo" : "'+ this.#cod_veic + '",' +
               '"modelo do veículo" :  "' + this.#modelo_veic + '",' +
               '"descrição do veículo" : "'     + this.#desc_veic      + '",' +
               '"valor do veículo" : "'    + this.#valor_veic     + '" ' +
           '}';   
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Veiculo(obj.cod_veic, obj.modelo_veic, obj.desc_veic, obj.valor_veic);
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validar_cod_veiculo(cod_veic) {
    if(cod_veic == null || cod_veic == "" || cod_veic == undefined)
      return false;
    const padrao_cod_veic = /[0-9]/;
    if (!padrao_cod_veic.test(cod_veic))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validar_modelo_veic(modelo_veic) {
      if(modelo_veic == null || modelo_veic == "" || modelo_veic == undefined)
      return false;
    if (modelo_veic.length > 40) 
      return false;
    const padrao_modelo_veic = /[A-Z][a-z] */;
    if (!padrao_modelo_veic.test(modelo_veic)) 
      return false;
    return true;
  }
  }

  //-----------------------------------------------------------------------------------------//

  static validar_desc_veic(desc_veic) {
    if(desc_veic == null || desc_veic == "" || desc_veic == undefined)
      return false;
    if (nome.length > 100) 
      return false;
    const padrao_desc_veic = /[A-Z][a-z] */;
    if (!padrao_desc_veic.test(desc_veic)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validar_valor_veic(valor_veic) {
    if(valor_veic == null || valor_veic == "" || valor_veic == undefined)
      return false;
    const padrao_valor_veic = /[0-9]+,[0-9]/;
    if (!padrao_valor_veic.test(valor_veic)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

   
  mostrar() {
    let texto = "Codigo do veículo: " + this.cod_veic + "\n";
    texto += "Modelo do veículo: " + this.modelo_veic + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}