import { TabStripItem } from '../../components/tab-strip/tab-strip.item';
import { MainMenuItem } from '../../components/main-menu/main-menu.item';

/** @description
 * Deve-se implementar esta interface nos componentes DataForm caso exista a necessidade de interceptar o submit do
 * formulário nos themas. */
export interface OnBeforeSubmit {

    /** @description
     * Evento disparado antes do submit e tem três tipos de retorno:
     * @return False quando houver a necessidade de impedir o envio do formulário.
     *
     * @return Objeto JSON padrão para substituir o dataSource que será enviado no post. Este cenário é útil
     * quando for necessário realizar algum tratamento nos dados, mudar sua estrutura por completo ou qualquer outra necessidade.
     *
     * @return True caso o submit possa ocorrer normalmente usando a estrutura definida pelo próprio formulário
     * reativo (form.value).
     */
    clOnBeforeSubmit(): boolean | any;
}

/** @description
 * Implemente esta interface caso deseje interceptar o fluxo logo após a conclusão do submit dos dados.
 */
export interface OnAfterSubmit {

    /** @description
     * Intercepta a ação pós submit.
     * @param e Retorno disparado pelo método executado no serviço HTTP.
     */
    clOnAfterSubmit(e: any): void;
}

/** @description Implemente esta interface no DataList do projeto cliente, para que a estrutura de busca seja devidamente implementada. */
export interface OnSearch {

    /** @description
     * Evento de busca disparado pelo tema. O parâmetro é o critério de pesquisa recebido.
     * Neste método deve ser implementada a lógica de busca no servidor.
     *
     * Existe uma constante chamada APP_TOTAL_LENGTH_TO_SEARCH que pode ser utilizada para auxiliar na regra definida para a busca.
     *
     * @param e Critério de busca do tipo string.
    */
    clOnSearch(e: string): void;
}

/** @description
 * Implemente esta interface no DataForm caso queira executar alguma ação antes que o dataSource seja carregado.
 * Lembrando que o dataSource somente será carregado se alguma key for passada ao componente.
 * O cenário mais comum para este caso é na edição de um registro.
 */
export interface OnBeforeLoadDataSource {

    /** @description
     * Evento disparado antes de executar o get que retorna um determinado registro a partir de sua key.
     */
    clOnBeforeLoadDataSource(): void;
}

/** @description
 * Implemente esta interface no DataForm caso queira executar alguma ação após o dataSource ser carregado.
 * Lembrando que o dataSource somente será carregado se alguma key for passada ao componente.
 * O cenário mais comum para este caso é na edição de um registro.
 */
export interface OnAfterLoadDataSource {

    /** @description
     * Evento disparado depois de executar o get que retorna um determinado registro a partir de sua key.
     */
    clOnAfterLoadDataSource(): void;
}

/** @description
 * Implemente esta interface no DataList caso queira interceptar a ação de exclusão de registros.
 */
export interface OnBeforeDelete {

    /** @description
     * Intercepta a exclusão e caso o retorno seja false, a exclusão é interrompida.
     * @return True para que a execução siga o fluxo normal.
     */
    clOnBeforeDelete(): boolean;
}

/** @description
 * Implemente esta interface no DataList caso queira interceptar a ação pós exclusão de registros.
 */
export interface OnAfterDelete {

    /** @description
     * Intercepta o momento pós exclusão do registro.
     */
    clOnAfterDelete(): void;
}

/** @description
 * Implemente esta interface no componente que consome o TabStrip caso queira interceptar o momento em que o componente passado
 * por parâmetro for instanciado.
 */
export interface OnLoadComponentInstance {

    /** @description
     * Evento disparado antes de carregar o componente principal da tab.
     * @param e Instância da classe TabStripItem, normalmente contendo os dados da tab que será interceptada.
     */
    clOnLoadComponentInstance(e: TabStripItem): void;
}

/** @description
 * Implemente esta interface no componente que consome o TabStrip caso queira interceptar o momento em que a tab está sendo fechada.
 */
export interface OnTabClosing {

    /** @description
     * Evento disparado antes de fechar a tab.
     * @param e Instância da classe TabStripItem, normalmente contendo os dados da tab que será interceptada.
     */
    clOnTabClosing(e: TabStripItem): boolean;
}

/** @description
 * Implemente esta interface no componente que consome o TabStrip caso queira interceptar no momento em que a tab já foi fechada.
 */
export interface OnTabClosed {

    /** @description
     * Evento disparado na conclusão do fechamento da tab. É a última ação executada antes de remover o elemento do DOM.
     * @param e Instância da classe TabStripItem, normalmente contendo os dados da tab que será interceptada.
     */
    clOnTabClosed(e: TabStripItem): void;
}

/** @description
 * Implemente esta interface no componente que consome o TabStrip.
 */
export interface OnCloseData {

    /** @description
     * Caso esteja implementado, chama o método que finaliza a instância do componente.
     */
    clOnCloseData(): void;
}

/** @description
 * Implemente esta interface quando o tema principal for fazer uso do componente de contexto.
 * Ex: Adicionar algum combobox para troca de lojas, ou dropdown de usuários.
 */
export interface OnContextHeaderOutput {

    /** @description
     * Evento disparado toda vez que o ContextHeader dispara o evento de Output.
     * @param e Valor informado pelo output. Pode ser qualquer coisa pois depende do contexto de implementação.
     */
    clOnContextHeaderOutput(e: any): void;
}

/** @description
 * Implementar esta interface no componente que estiver utilizando o MainMenu.
 */
export interface OnMenuOpenning {
    /** @description
     * Evento disparado antes de iniciar a abertura do menu.
     * @param e Instância da classe MainMenuitem contendo os dados do menu que está sendo aberto
     */
    clOnMenuOpenning(e: MainMenuItem);
}

/** @description
 * Implementar esta interface no componente que estiver utilizando o MainMenu.
 */
export interface OnMenuOpened {
    /** @description
     * Evento disparado na conclusão da abertura do menu.
     * @param e Instância da classe MainMenuitem contendo os dados do menu que foi aberto
     */
    clOnMenuOpened(e: MainMenuItem);
}

/** @description
 * Implementar esta interface no componente que estiver utilizando o MainMenu.
 */
export interface OnMenuClosing {
    /** @description
     * Evento disparado no inicio do processo de fechamento do menu.
     * @param e Instância da classe MainMenuitem contendo os dados do menu que está sendo fechado
     */
    clOnMenuClosing(e: MainMenuItem);
}

/** @description
 * Implementar esta interface no componente que estiver utilizando o MainMenu.
 */
export interface OnMenuClosed {
    /** @description
     * Evento disparado na conclusão do fechamento do menu.
     * @param e Instância da classe MainMenuitem contendo os dados do menu que foi fechado.
     */
    clOnMenuClosed(e: MainMenuItem);
}

/** @description
 * Implementar esta interface caso haja necessidade de interceptar o erro do submit do form.
 */
export interface OnErrorSubmit {
    /** @description
     * Evento disparado no momento em que o erro de submit ocorre
     * @param e Instância ou mensagem de erro. Pode ser um objeto ou uma string.
     */
    clOnErrorSubmit(e: string);
}
