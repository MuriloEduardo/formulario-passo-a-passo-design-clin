app.controller('formPassosCtrl', function($rootScope, $scope, $http, $location){

	if($(window).scrollTop()!=0){$('html,body').stop().animate({scrollTop:0},1500,'easeInOutExpo');}
	
	$scope.passo 		   = 1;
	$scope.forca_senha 	   = 0;
	$scope.loadingCep      = false;
	$scope.sucesso 		   = false;
	$scope.loadingCepImage = 'fa-spinner fa-pulse fa-fw';
	$scope.loadingSend     = 'fa-long-arrow-right';

	var forTop = function(el) {
		$('html,body').animate({scrollTop:$(el).offset().top},1500);
	}
	
	var dadosCadastro = {
		email: '',
		senha: '',
		nome: '',
		cpf: '',
		dtNascimento: '',
		titLoja: '',
		cnpj: '',
		telefone:'',
		dominioDesej: '',
		ramo: '',
		endereco: '',
		numero: '',
		complemento: '',
		bairro: '',
		estado: '',
		cep: '',
		cidade: '',
		plano: '',
		termos: '',
		codPromocional: '',
		codSeguranca: '',
		confirm_senha: ''
	}

	$http.get('./js/json/localidadeAPI/All-estados.json').success(function(data) {
		$scope.estados = data.estados;
	}).error(function(error) {
		console.error(error)
	});

	$scope.passosCadastro = function(direction, dados, form){

		if(direction){
			validaCampos(form);
		}else{
			res = true;
			$scope.passo = $scope.passo - 1;
			forTop('.box-cadastro');
		}

		if (res && direction && dados){

			dadosCadastro.email 		 = dados.email;
			dadosCadastro.senha 		 = dados.senha;
			dadosCadastro.confirm_senha  = dados.confirm_senha;
			dadosCadastro.nome 			 = dados.nome;
			dadosCadastro.cpf 			 = dados.cpf;
			dadosCadastro.dtNascimento 	 = dados.dtNascimento;
			dadosCadastro.titLoja 		 = dados.titLoja;
			dadosCadastro.cnpj 			 = dados.cnpj;
			dadosCadastro.telefone 		 = dados.telefone;
			dadosCadastro.dominioDesej   = dados.dominioDesej;
			dadosCadastro.ramo 			 = dados.ramo;
			dadosCadastro.endereco		 = dados.endereco;
			dadosCadastro.numero 		 = dados.numero;
			dadosCadastro.complemento 	 = dados.complemento;
			dadosCadastro.bairro 		 = dados.bairro;
			dadosCadastro.estado 		 = dados.estado;
			dadosCadastro.cep 			 = dados.cep;
			dadosCadastro.cidade 		 = dados.cidade;
			dadosCadastro.plano 		 = dados.plano;
			dadosCadastro.termos 		 = dados.termos;
			dadosCadastro.codPromocional = dados.codPromocional;
			dadosCadastro.codSeguranca   = dados.codSeguranca;

			if(direction){
				if($scope.passo == 4){
					saveCadastro();
					if($scope.sucesso){
						$scope.passo = $scope.passo + 1;
					}
				}else{
					$scope.passo = $scope.passo + 1;
					forTop('.box-cadastro');
				}
				res = false;
			}else{
				$scope.passo = $scope.passo - 1;
				forTop('.box-cadastro');
				res = true;
			}
		}
	}

	$scope.colocarCorTooltip = function() {
    	$('div.tooltip').addClass('red');
    }

	var validaCampos = function(form) {

        $('form[name="' + form + '"] input[required="required"], form[name="' + form + '"] select[required="required"], form[name="' + form + '"] label[required="required"]').each(function() {
            var t = $(this);
            if(!t.val()){

        		if(t[0].type == 'hidden'){
            		
            		forTop('.box-cadastro');
            		$('form[name="' + form + '"] .planos').addClass('camposEmBrancoPlanos');
	            	setTimeout(function(){ $('form[name="' + form + '"] .planos').removeClass('camposEmBrancoPlanos'); }, 1800);
            	}else{
            		
            		t.addClass('camposEmBranco');
	        		t.focus();

	        		$scope.emailInvalido  = false;
	        		$scope.loginMinlength = false;
	        		$scope.senhaFraca 	  = false;
	        		$scope.siteInvalido   = false;
            	}
                
                return res = false;
            }else{
            	if(t[0].type == 'email' && !validateEmail(t.val())){
            		$scope.emailInvalido = true;
            		t.addClass('camposEmBranco');
            		t.focus();
            		
            		return res = false;
            	}else if(t[0].attributes.id && t[0].attributes.id.nodeValue == 'siteUrl' && !validateSite(t.val())){
            		$scope.siteInvalido = true;
            		t.addClass('camposEmBranco');
            		t.focus();
            		
            		return res = false;
            	}else if(t.hasClass('ng-invalid-mask')){
            		t.addClass('camposEmBranco');
            		t.focus();
            		
            		return res = false;
            	}else if(t.hasClass('emailja')){
            		t.addClass('camposEmBranco');
            		t.focus();
            		
            		return res = false;
            	}else if(t.hasClass('ng-invalid-pwmatch')){
            		t.addClass('camposEmBranco');
            		t.focus();
            		
            		return res = false;
            	}else if(t.hasClass('ng-invalid-minlength')){
            		$scope.loginMinlength = true;
            		t.addClass('camposEmBranco');
            		t.focus();

            		return res = false;
            	}else if(t.hasClass('sf')){
            		$scope.senhaFraca = true;
            		t.addClass('camposEmBranco');
            		t.focus();

            		return res = false;
            	}else{
            		t.removeClass('camposEmBranco');
            		$('form[name="' + form + '"] .planos').removeClass('camposEmBrancoPlanos');
            		$scope.emailInvalido = false;

            		return res = true;
            	}
            }
        });
    }

    $scope.buscaCep = function(cep) {

		if(cep){

			if(cep.indexOf('.') != -1){
				cep = cep.replace('.', '');
			}else if(cep.indexOf('-') != -1){
				cep = cep.replace('-', '');
			}

			if (cep.length >= 8) {
				
				$scope.loadingCep = true;

				$http.get('https://viacep.com.br/ws/' + cep + '/json/').then(function(response) { 

					if (response.status == 200) {
						if(response.data.erro){
							$scope.loadingCepImage = 'fa-times';	
						}else{
							// Achou o cep
							$scope.loadingCepImage = 'fa-check';

							$scope.cadastro.cidade      = response.data.localidade;
							$scope.cadastro.estado      = response.data.uf;
							$scope.cadastro.endereco    = response.data.logradouro;
							$scope.cadastro.complemento = response.data.complemento;
							$scope.cadastro.bairro      = response.data.bairro;
						}
					}else{
						$scope.loadingCepImage = 'fa-times';
					}
				});
			}else{
				$scope.loadingCepImage = 'fa-times';
			}
		}
	}

	var saveCadastro = function(){
		
		$scope.loadingSend = 'fa-spinner fa-pulse fa-fw';
		$scope.sucesso = true;
	}

	$scope.verificaEmail = function(email) {
    	if(validateEmail(email)){
    		var dados = { "email": email, "table": "loja"}
			$http.post('../json/verifica_email.php', dados).success(function(data, status) {
				if(data == '1'){
					$scope.emailja = true;
					$('input[type="email"]').addClass('emailja');
				}else{
					$scope.emailja = false;
					$('input[type="email"]').removeClass('emailja');
				}
	        });
    	}
    }

	function validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	function validateSite(site) {
		var re = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9_\-]+)+\.([a-zA-Z]{2,4})(?:\.([a-zA-Z]{2,4}))?\/?(.*)$/;
		return re.test(site);
	}

	$scope.marcaPlano = function(el){
		$('#planoInput').val(el);
		$scope.cadastro = { plano: el }
		var _el = $('#' + el);
		$('.planos').each(function() {
			$(this).removeClass('plano-escolhido');
		});
		if(_el.hasClass('plano-escolhido')){
			_el.removeClass('plano-escolhido');
		}else{
			_el.addClass('plano-escolhido');
		}
	}

	$('[data-toggle="tooltip"]').tooltip();

	$("#senha").complexify({}, function (valid, complexity) {
        $scope.forca_senha = complexity;
        if(complexity > 0 && complexity < 10){
        	$(this).addClass('sf');
        }else{
        	$(this).removeClass('sf');
        }
    });

    $('#dtNascimento').datepicker({
	    format: 'dd/mm/yyyy',
	    language: 'pt-BR',
	    orientation: 'bottom auto',
    	autoclose: true
	});

	var urlCru = $location.absUrl();
    if(urlCru.indexOf("?") != -1){
    	var url = $location.absUrl().split('?')[1];
	    url = decodeURIComponent(url.trim());

	    if(url.split('=')[0] == 'email'){
	    	$scope.cadastro = {email: url.split('=')[1]}
	    	$('[activeTooltip="planos"]').tooltip('show');
	    }else{
	    	$('[activeTooltip="planos"]').tooltip('disable');
	    }

	    if(url.split('=')[0] == 'plano'){
	    	var plano = url.split('=')[1];
	    	$scope.marcaPlano('plano-' + plano);
	    }
    }else{
    	$('[activeTooltip="planos"]').tooltip('disable');
    }
});