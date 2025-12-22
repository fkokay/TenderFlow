var EFlang = new function () {
    this.localeCode = "pt";
    this.noRecordsFound = "Nenhum registro encontrado.";
    this.Save = "Guardar";
    this.Currency = "BRL";
    this.UploadText = "Escolha o arquivo";
    this.CancelText = "cancelar";
    this.UploadFailText = "Falha no upload";
    this.RetryText = "Por favor, tente novamente";
    this.waitingForResponseText = "carregando ...";
    this.PleaseWait = "Por favor, aguarde ...";
    this.FileRequired = "Selecionar arquivo";
    this.StartProcess = 'Tem certeza de que deseja iniciar o processo chamado "{0}"?';
    this.GridRequiredError = 'insira todos os campos obrigatórios';
    this.Error = 'erro!';
    this.Warning = 'warning';
    this.DateError = 'O formato da data está incorreto';
    this.Required = "Este campo é obrigatório.",
    this.InvalidDate = "Por favor, insira uma data válida.",
    this.InvalidNumber = "Por favor, insira um número válido",
    this.Days = "day",
    this.Minutes = "minute",
    this.Hours = "hour",
    this.MoreThanDays = "Dias",
    this.MoreThanMinutes = "Minutos",
    this.MoreThanHours = "Horas",
    this.MoreThan = "Mais que"
    this.LessThan = "Menor que";
    this.Close = "Perto";

    this.F_Today = "hoje";
    this.F_Yesterday = "ontem";
    this.F_ThisWeek = "Esta semana";
    this.F_ThisMonth = "Este mês";
    this.F_ThisYear = "Este ano";
    this.F_CurrentUser = "CurrentUser ()";
    this.F_Days = "dia";
    this.F_Hours = "Horas";
    this.F_Minutes = "minuto";
    this.Required = "Você deve preencher este campo";
    this.MinLength = "Por favor, digite pelo menos {0} caracteres";
    this.UnknownError = "Erro desconhecido";
    this.WrongUsernameOrPassword = "Nome de usuário ou senha incorretos";
    this.CantConnectLdapServer = "Não foi possível conectar ao servidor Ldap";

    this.GeoLocation_PERMISSION_DENIED = "O usuário recusou-se a compartilhar informações.";
    this.GeoLocation_POSITION_UNAVAILABLE = "a informação não está disponível.";
    this.GeoLocation_TIMEOUT = "O tempo acabou";
    this.GeoLocation_UNKNOWN_ERROR = "Um erro desconhecido";
    this.GeoLocation_NOT_SUPPORTED = "O navegador usado não suporta esta função.";
    this.GeoLocation_ONLY_SECURE_ORIGINS = "Requer uma conexão segura. (HTTPS)";
    this.Clean_Up_OCR_Filled_Fields = "Limpar campos preenchidos com OCR?";
    this.LoadingAndOcrParsing = "A análise de OCR está em curso";
    this.AddFilter = "ADICIONAR FILTRO";
    this.ReportDetail = "Pare o Rapor";
    this.DashboardDetail = "Detalhes do painel";
    this.DashboardName = "Nome do painel";
    this.ReportName = "Nome do Relatório";

    this.Contains = "Contém";
    this.NotContains = "Não contém";
    this.ThanBefore = "Than Before";
    this.LaterThan = "Mais tarde que";
    this.DateRange = "Intervalo de datas";
    this.BiggerThan = "Maior que";
    this.SmallerThan = "Menor que";
    this.ExactMatch = "Correspondência exata";
    this.FilterProcessName = "Processo: ";
    this.Savedsuccessfully = "Alterações salvas com sucesso";

    this.FavouriteFilters = "Filtros Favoritos";
    this.LocationDataNotFound = "Dados do local não encontrados";
    this.DeleteConfirm = "Tem certeza de que deseja excluir?"
    this.Previous = "Anterior";
    this.Next = "Next";
    this.Total = "Total";
    this.RecordsOfListing = "";
    this.Loading = "Carregando ..";
    this.ShowMore = "Mostrar mais";
    this.QueryRunSucceed = "Consulta bem-sucedida";
    this.SpParameterValidate = "Digite todos os parâmetros para o procedimento armazenado";
    this.QueryNotDefined = "Consulta não definida";
    this.FilterParameterVal = " Valor do parâmetro"

    this.FilterGroupNo = "Group No"
    this.FilterGroupName = "Group Name"
    this.FilterGroupMember = "Group Member"
    this.FilterGroupSpecCode = "Group Spec Code 1 ...5"

    this.FilterName = "Name"
    this.FilterSurname = "Surname"
    this.FilterUsername = "Username"
    this.FilterGroup = "Group"
    this.FilterStatus = "Status"

    this.ReportSuccessful = "Criado com sucesso"
    this.ReportFailed = "Já existe um relatório com o mesmo nome."

    this.FilterAllAssigned = "Todos";
    this.FilterAllAssignedBtnHover = "Use o elemento de dados TaskAssignedTo para filtrar o usuário atribuído que está relacionado ao processo";
    this.FilterProcesses = "Processos";
    this.FilterTask = " tarefas ";
    this.FilterTotalTask = "Total de tarefas";
    this.FilterAssigned = "Atribuído: ";
    this.BarChartTitle = "Usuários e grupos atribuídos";

    this.PanelUserGroupConfirm = "Os {1} registros do {0} que você selecionou serão listados, você confirma?";

    this.PleaseSelect = "Selecione";

    this.EmptyStatusPieChart = "Registros de status vazios serão listados, você confirma?";
    this.CountStatusPieChart = "registros serão listados, você confirma?";

    this.Old = "Stary";
    this.New = "Nowy";
    this.Preview = "Pré-visualização";
    this.UnableToPreviewFile = "Não é possível visualizar o ficheiro";
    this.ItemsShowing = "Mostrando {0} itens.";

    this.Next = 'Próximo';
    this.Prev = 'Anterior';
    this.Done = 'Concluído';

    //Virtual Tour Base Items Start
    this.dashboardTitle = `Bem-vindo ao seu Novo Dashboard`;
    this.dashboardTitleDetail = `           
            <p>
               Seu Dashboard foi projetado para ajudá-lo a acompanhar suas tarefas diárias e acessar rapidamente os recursos mais utilizados. Você pode personalizá-lo de acordo com suas necessidades e acessar instantaneamente os recursos que mais usa. No primeiro uso, você encontrará um tour instrutivo que o guiará passo a passo para descobrir todas as funcionalidades do dashboard. Durante o tour:
            </p>
            <p>
            •	Você verá breves explicações sobre cada funcionalidade. <br>
            •	Poderá navegar entre os passos usando os botões "Anterior" e "Próximo". <br>
            •	Você pode fechar o tour a qualquer momento e reiniciá-lo mais tarde. 
            </p>
            <p>
            <h1 class="driver-title"> Trabalhando com Widgets </h1>
            •	Arrastar e Soltar: Você pode mover os widgets para qualquer lugar na página. <br>
            •	Redimensionamento: Você pode aumentar ou diminuir o tamanho de cada widget conforme necessário. <br>
            •	Edição: Use o botão "+" para adicionar ou remover widgets. 
            </p>
            `;

    this.condenseDashboard = `Compactar para uma Visualização Compacta`;
    this.condenseDashboardDetail = `<p> Você pode organizar os widgets automaticamente de forma ordenada. </p>`;
    this.undoDashboardChanges = `Voltar ao Layout Salvo`;
    this.undoDashboardChangesDetail = `<p> Você pode retornar ao layout salvo com um único clique. </p>`;
    this.saveCurrentDashboard = `Salvar Layout Atual`;
    this.saveCurrentDashboardDetail = `<p> Salve o layout atual para uso futuro. </p>`;
    this.addRemovePanel = `Personalize sua Área de Trabalho com o Botão Adicionar/Remover`;
    this.addRemovePanelDetail = `<p> Use o botão "+" para adicionar ou remover widgets.  </p>`;
    //Virtual Tour Base Items End

    //Virtual Tour Widgets Start
    this.gridStack_998 = `Processos Recentes`;
    this.gridStack_998Detail = `<p>
                               • Visualize os processos que você executou recentemente. <br> 
                               • Clique no nome do processo para iniciar um novo. <br> 
                               • Personalize as cores dos ícones. </p>`;

    this.gridStack_999 = `Listas Recentes`;
    this.gridStack_999Detail = `<p>  
                               • Acesse os processos mais usados com um único clique. <br>  
                               • Diferencie os processos facilmente com cartões visuais. <br> 
                               • Personalize os ícones dos processos. </p>`;

    this.gridStack_1000 = `Tarefas Pendentes`;
    this.gridStack_1000Detail = `<p>   
                                • Liste as tarefas atribuídas a você.  <br> 
                                • Acesse rapidamente o formulário da tarefa.  <br> 
                                • Classifique as tarefas por diferentes critérios. </p>`;

    this.gridStack_1001 = `Tarefas Diárias`;
    this.gridStack_1001Detail = `<p>   
                                 •  Acompanhe suas tarefas diárias em uma visão de calendário.  <br> 
                                 •  Navegue entre os dias usando as setas.  <br>
                                 •  Clique em uma data para ver as tarefas do dia. </p>`;

    this.gridStack_1002 = `Processos Frequentes`;
    this.gridStack_1002Detail = `<p>  
                                • Visualize os processos que você executou recentemente. <br>
                                • Clique no nome do processo para iniciar um novo. <br>
                                • Personalize as cores dos ícones. </p>`;

    this.gridStack_1003 = `Listas Frequentes`;
    this.gridStack_1003Detail = `<p>  
                                • As listas mais usadas são exibidas com ícones e designs de cores personalizados. <br> 
                                • Designs visuais personalizados para cada lista. <br> 
                                • Acesso rápido a todas as listas através do link "Listas". </p>`;

    this.gridStack_1004 = `Documentos Recentes`;
    this.gridStack_1004Detail = `<p>  
                                 • Acesse instantaneamente os documentos que você abriu recentemente. <br> 
                                 • Clique no documento para visualizar seu conteúdo. <br> 
                                 • Diferenciação visual por tipo de documento (DOCX, PDF, TXT). </p> </p>`;

    this.gridStack_1005 = `Documentos Favoritos`;
    this.gridStack_1005Detail = `<p>  
                                 • Adicione documentos importantes aos favoritos. <br> 
                                 • Acesse seus documentos favoritos com um único clique. <br> 
                                 • Indique o status de favorito com um ícone de estrela. </p>`;

    this.gridStack_1006 = `Listas Favoritas`;
    this.gridStack_1006Detail = `<p>  
                                • Adicione listas frequentemente usadas aos favoritos. <br> 
                                • Organização visual com ícones e designs de cores personalizados. <br> 
                                • Acesso fácil a todas as listas através do link "Listas".  </p>`;

    this.gridStack_1007 = `Relatórios Favoritos`;
    this.gridStack_1007Detail = `<p>  
                                •	Armazene relatórios importantes nos favoritos. <br> 
                                •   Acesso a todos os relatórios através do link "Relatórios". <br> 
                                •	Acesso rápido aos relatórios mais usados. </p>`;

    this.gridStack_1008 = `Total de Processos`;
    this.gridStack_1008Detail = `<p>      
                                 • Visão abrangente dos processos que você iniciou. <br>
                                 • Acompanhamento dos processos em que você está envolvido e concluídos. <br>
                                 • Opções de filtro diário/semanal/mensal/anual. <br>
                                 • Acesso rápido aos detalhes do processo com um clique. <br>
                                 • Possibilidade de personalizar as cores dos ícones. </p> </p>`;

    this.gridStack_1009 = `Atividades`;
    this.gridStack_1009Detail = `<p>  
                                • Acompanhamento diário/semanal/mensal de atividades. <br>
                                • Monitoramento visual do seu fluxo de trabalho. <br>
                                • Ferramentas para aumentar a eficiência do processo. </p>`;

    this.gridStack_1010 = `Desempenho de Tarefas`;
    this.gridStack_1010Detail = `<p>  
                                 • Acompanhamento mensal das tarefas atribuídas. <br>
                                 • Análise horária das tarefas concluídas e pendentes. <br>
                                 • Medição e avaliação da sua eficiência de trabalho. </p>`;

    this.gridStack_1011 = `Seus Painéis Favoritos`;
    this.gridStack_1011Detail = `<p>  
                                • Adicione painéis de análise personalizados aos favoritos. <br>
                                • Acesso a todos os painéis através do link "Painéis". <br>
                                • Acesso rápido aos painéis mais usados. </p>`;
    //Virtual Tour Widgets End

    this.dateCompare = "A data de término deve ser posterior à data de início.";

    this.ESign_MobileSign = "Assinatura Eletrônica / Assinatura Móvel";

    this.Sign = "Assinar";

    this.DataNotFound = "Registro Não Encontrado";

    this.Contains = "Contém";

    this.MissingCardNumber = 'Número do cartão ausente';
    this.InvalidCardNumber = 'Número do cartão inválido';
    this.FullNameControlForCreditCard = 'Nome completo deve ter pelo menos 4 caracteres';
    this.InvalidAmountFormat = 'Por favor, insira um valor válido';
    this.MissingExpirationDate = 'Data de validade ausente';
    this.InvalidDate = 'Data inválida';
    this.ExpiredDate = 'Data expirada';
    this.MissingCvv = 'CVV ausente';

    this.userProfilePhotoBox = 'Arraste e solte sua foto ou <span class="filepond--label-action">carregue-a</span>';
    this.loadProfileImage = '<i class="fa fa-file-image"></i><span>Sua imagem enviada</span>';
    this.avatarEdit = 'Edição de avatar';
    this.delete = 'Excluir';
    this.setYourPhoto = '<i class="fa fa-crop-alt"></i><span>Defina sua foto</span>';
    this.labelFileTypeNotAllowed = 'Você só pode enviar arquivos JPG, JPEG, PNG!';
    this.labelMaxFileSizeExceeded = 'O tamanho do arquivo deve ser no máximo 2MB.';
    this.uploadProfilePhotoError = 'Não foi possível enviar a imagem do perfil.';
    this.removeProfilePhotoError = 'Não foi possível remover a imagem do perfil.';

    this.AskConfirm = "Tem certeza?";
    this.ExcelConfirm = "Os dados do Line Item serão baixados em formato Excel.";
    this.ExcelConfirmButtonText = "Sim, baixar";
    this.Cancel = "Cancelar";
    this.SelectUserOrGroup = "Por favor, selecione um grupo ou um usuário";
}