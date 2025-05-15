//seleciona os elementos do formulário.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");


//Seleciona os elementos da lista.
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

//captura o evento de input e formata o valor.
amount.oninput = () => {
  //obtém o valor atual do imput e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "");

  //Transformar o valor em centavos.
  value = Number(value) / 100;

  //atualiza o valor do input.
  amount.value = formatCurrencyBRL(value);
};

//Formata o valor no padrão BRL.
function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}

//captura o evento de submit do formulário.
form.onsubmit = (event) => {
  //previne o comportamento padrão de recarregar a página.
  event.preventDefault();
  //Cria um novo objeto com os detalhes da nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  };
  

  //chamando a função que adicionará a despesa na lista.
  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    //criou o elemento li para add o item(li) na lista(ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //Cria o icone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseItem.setAttribute("alt", newExpense.category_name);

    //Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //criar nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense

    //cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name

    //Adiciona name e category na div expense Info
    expenseInfo.append(expenseName, expenseCategory);

    //Adicionando o valor da despesa 
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    //Adicionando o icone de remover

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover")


    //Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)
    expenseList.append(expenseItem);

    //Atualiza os totais
    updateTotals()
  } catch (e) {
    alert("Não foi possivel atualizar a lista de despesas.");
    console.log(e);
  }

  //chama a função que limpa o formulário
  formClear()
}

function updateTotals() {
  try {
  //recupera todos os itens (li) da lista (ul).
    const items = expenseList.children
    
    //atualiza quantidade de itens da lista.

    expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    //variavel para encrementar o total.
    let total = 0

    //Percorre cada item (li) da lista(ul).
    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      //pega o valor e remove os caracteres não numéricos e substitui a virgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace("," , ".")

      //Converte o valor para float.
      value = parseFloat(value)

      //verificar se é um número válido.
      if(isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número.")
      }

      //Encrementa o valor total.
      total += Number(value)  
    }

    //Cria s span para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    //Formata o valor e remove o R$ que será exibido pelo small com estilo personalizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    //Limpa o conteúdo.
    expensesTotal.innerHTML = ""

    //add simbolo de moeda e o valor formatado.
    expensesTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error);
    alert("Não foi possível obter os totais");
  }
}


//Evento que captura o clique nos itens da lista.

expenseList.addEventListener("click", function(event){

  //verifica se o elemento clicado é o ícone de remover.
  if(event.target.classList.contains("remove-icon")) {
    //obtem a li pai do elemento clicado.
    const item = event.target.closest(".expense")


    //remove o item da lista.
    item.remove()

  }

  //Atualiza os totais.
  updateTotals()
})

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}