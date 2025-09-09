import { animais } from './animais.js';
import { Erros } from './erros.js';

class AbrigoAnimais {

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const listaAnimais = {};
    const resultado = { lista: [], erro: null };
    const adotados = { 'pessoa 1': 0, 'pessoa 2': 0 };

    const brinquedos1 = this._validaBrinquedos(brinquedosPessoa1, resultado);
    if (!brinquedos1) return resultado;

    const brinquedos2 = this._validaBrinquedos(brinquedosPessoa2, resultado);
    if (!brinquedos2) return resultado;

    const ordem = ordemAnimais.split(',').map(a => a.trim());
    const nomesValidos = Object.keys(animais);

    const duplicados = ordem.filter((item, idx) => ordem.indexOf(item) !== idx);
    for (let nome of ordem) {
      if (!nomesValidos.includes(nome) || duplicados.length > 0) {
        resultado.erro = Erros.animalInvalido;
        resultado.lista = null;
        return resultado;
      }
    }

    for (let nome of ordem) {
      const animal = animais[nome];
      const pode1 = this._atendeOrdem(brinquedos1, animal.brinquedos);
      const pode2 = this._atendeOrdem(brinquedos2, animal.brinquedos);
      let dono = 'abrigo';
      if (nome === 'Loco') {
        if (ordem.length > 1) { 
          dono = 'pessoa 1'; 
          adotados[dono]++;
        }
      } else if (animal.tipo === 'gato') {
        if (pode1 && !pode2 && adotados['pessoa 1'] < 3) dono = 'pessoa 1';
        else if (pode2 && !pode1 && adotados['pessoa 2'] < 3) dono = 'pessoa 2';
      } else {
        if (pode1 && !pode2 && adotados['pessoa 1'] < 3) dono = 'pessoa 1';
        else if (!pode1 && pode2 && adotados['pessoa 2'] < 3) dono = 'pessoa 2';
        else if (pode1 && pode2) dono = 'abrigo';
      }

      if (dono !== 'abrigo') adotados[dono]++;
      listaAnimais[nome] = `${nome} - ${dono}`;
    }

    resultado.lista = Object.values(listaAnimais).sort();
    return resultado;
  }

  _atendeOrdem(brinquedosPessoa, brinquedosAnimal) {
    const arr = brinquedosPessoa.split(',').map(b => b.trim());
    let idx = 0;
    for (let b of brinquedosAnimal) {
      idx = arr.indexOf(b, idx);
      if (idx === -1) return false;
      idx++;
    }
    return true;
  }

  _validaBrinquedos(brinquedos, resultado) {
    const arr = brinquedos.split(',').map(b => b.trim());
    const duplicados = arr.filter((item, idx) => arr.indexOf(item) !== idx);
    if (duplicados.length > 0) {
      resultado.erro = Erros.brinquedoInvalido;
      return null;
    }
    return brinquedos;
  }
}

export { AbrigoAnimais };
