import java.util.ArrayList;
import java.util.Scanner;

class Animal {
    String nome, especie, contato;

    // Construtor: usado para preencher os dados do animal assim que ele é criado
    public Animal(String nome, String especie, String contato) {
        this.nome = nome;
        this.especie = especie;
        this.contato = contato;
    }
}

public class Main {
    public static void main(String[] args) {
        // Listas dinâmicas para separar quem perdeu de quem encontrou
        ArrayList<Animal> perdidos = new ArrayList<>();
        ArrayList<Animal> encontrados = new ArrayList<>();
        Scanner leitor = new Scanner(System.in);

        // Laço de repetição para o menu aparecer novamente após cada ação
        while (true) {
            System.out.println("\n1- Cadastrar animal Perdido\n2- Cadastrar Encontrado\n3- Listar\n4- Sair");
            int opcao = leitor.nextInt();
            leitor.nextLine(); // Limpa o buffer do teclado

            if (opcao == 4) break; // Encerra o programa

            if (opcao == 1 || opcao == 2) {
                String n = "Desconhecido"; // Define um nome padrão
                
                // Só pede o nome se for um animal PERDIDO (Opção 1)
                if (opcao == 1) {
                    System.out.print("Nome do animal: ");
                    n = leitor.nextLine();
                }

                System.out.print("Espécie (ex: Cão, Gato): ");
                String e = leitor.nextLine();
                System.out.print("Telefone para contato: ");
                String t = leitor.nextLine();

                // Cria o novo objeto animal com as informações coletadas
                Animal novo = new Animal(n, e, t);

                // Guarda o animal na lista correta baseada na escolha do usuário
                if (opcao == 1) perdidos.add(novo);
                else encontrados.add(novo);
                
                System.out.println("Cadastrado com sucesso!");

            } else if (opcao == 3) {
                // Percorre a lista de perdidos e imprime cada um
                System.out.println("\n--- LISTA DE PERDIDOS ---");
                for (Animal a : perdidos) {
                    System.out.println(a.nome + " (" + a.especie + ") - Fone: " + a.contato);
                }
                
                // Percorre a lista de encontrados e imprime cada um
                System.out.println("\n--- LISTA DE ENCONTRADOS ---");
                for (Animal a : encontrados) {
                    System.out.println(a.nome + " (" + a.especie + ") - Fone: " + a.contato);
                }
            }
        }
    }
}
