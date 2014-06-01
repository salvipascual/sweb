//------------------------------------------------------------------------------------------------------
//	Biblioteca de clases sWeb para estandarizar el comportamiento de los navegadores Web
//	desarrollado por Salvi Pascual, 17 / 3 / 09
//	version: 2.0
//------------------------------------------------------------------------------------------------------
/**     La linea siguiente define la inclusion del DOM estandar.
		A partir de ella utilice la variable doc como referencia 
		al objeto <body> en vez de la sentencia document.
*/
var sWeb, doc = null;
window.onload = new Function("sWeb = new sWebBase();");

/**
	Objeto para ejecutar eventos sWeb
*/
var events = {
	// se ejecuta cuando el arbol sWeb es creado, por parametro el tiempo de creacion
	onCreateSWebTree: null, 
	onPageLoad: null, 

	// para ejecutar el evento onCreateSWebTree
	fnCreateSWebTree: function (arg){ 
		function fires(){ events.fnCreateSWebTree(arg); }
		if(!events.onCreateSWebTree || !sWeb){
			var cls = setTimeout(fires,1000);
		}else{
			window.clearTimeout(cls);
			events.onCreateSWebTree(arg);
		}
	}
};

/**
	Objeto para medir el tiempo pasado entre dos sucesos
	Utilizado para las puebas de sWeb, puede eliminarse 
	en la version oficial.
*/
var timer = {
	time: 0,

	start: function(){
		timer.time = new Date().getTime();
	},

	stop: function(){ 
		return new Date().getTime() - timer.time;
	}
};

/**
	Objeto para definir patrones de disenno
	Patrones definidos:
		- singletton
		- virtual
*/
var designTemplates = {
	// para realizar singletton
	sWebGlobals: false,
	sWebBase: false,
	DOMImplementation: false,
	Document: false,
	DocumentType: false,

	singletton: function(classptr)
	{
		if(classptr instanceof sWebGlobals){
			if(this.sWebGlobals)
				throw new Error("Solo se permite crear una instancia de la clase sWebGlobals");
			else return this.sWebGlobals=true;
		}

		if(classptr instanceof sWebBase){
			if(this.sWebBase)
				throw new Error("Solo se permite crear una instancia de la clase sWebBase");
			else return this.sWebBase=true;
		}

		if(classptr instanceof DOMImplementation){
			if(this.DOMImplementation)
				throw new Error("Solo se permite crear una instancia de la clase DOMImplementation");
			else return this.DOMImplementation=true;
		}

		if(classptr instanceof Document){
			if(this.Document)
				throw new Error("Solo se permite crear una instancia de la clase Document");
			else return this.Document=true;
		}

		if(classptr instanceof DocumentType){
			if(this.DocumentType)
				throw new Error("Solo se permite crear una instancia de la clase DocumentType");
			else return this.DocumentType=true;
		}
	},

	// Para realizar virtual
	virtual: function(classptr){
		if(classptr instanceof sWebTree)
			throw new Error("No se puede crear una instancia de la clase sWebTree utilizando su constructor");

		if(classptr instanceof arrayMethods)
			throw new Error("No se puede crear una instancia de la clase arrayMethods utilizando su constructor");

		if(classptr instanceof Node)
			throw new Error("No se puede crear una instancia de la clase Node utilizando su constructor");
	}
};



/**
	Clase: sWebGlobals
	Clase para definir variables globales
	@singletton
*/
function sWebGlobals ()
{
	// Para permitir solamente una instancia de esta clase
	designTemplates.singletton(this);	
	
	/**
		Atributo publico global: browserDocument
		@datatype: HTMLDocument
	*/
	this.browserDocument = document;

	/**
		Atributo publico global: Codigo de las excepciones
	*/
	this.INDEX_SIZE_ERR              =  1; //If index or size is negative, or greater than the allowed value
	this.DOMSTRING_SIZE_ERR          =  2; //If the specified range of text does not fit into a DOMString
	this.HIERARCHY_REQUEST_ERR       =  3; //If any node is inserted somewhere it doesn't belong
	this.WRONG_DOCUMENT_ERR          =  4; //If a node is used in a different document than the one that created it
	this.INVALID_CHARACTER_ERR       =  5; //If an invalid or illegal character is specified, such as in a name.
	this.NO_DATA_ALLOWED_ERR         =  6; //If data is specified for a node which does not support data
	this.NO_MODIFICATION_ALLOWED_ERR =  7; //If an attempt is made to modify an object where modifications are not allowed
	this.NOT_FOUND_ERR               =  8; //If an attempt is made to reference a node in a context where it does not exist
	this.NOT_SUPPORTED_ERR           =  9; //If the implementation does not support the type of object requested
	this.INUSE_ATTRIBUTE_ERR         = 10; //If an attempt is made to add an attribute that is already in use elsewhere

	/**
		Atributo publico global: Tipos de nodo
	*/
	this.ELEMENT_NODE                = 1;
	this.ATTRIBUTE_NODE              = 2;
	this.TEXT_NODE                   = 3;
	this.CDATA_SECTION_NODE          = 4;
	this.ENTITY_REFERENCE_NODE       = 5;
	this.ENTITY_NODE                 = 6;
	this.PROCESSING_INSTRUCTION_NODE = 7;
	this.COMMENT_NODE                = 8;
	this.DOCUMENT_NODE               = 9;
	this.DOCUMENT_TYPE_NODE          = 10;
	this.DOCUMENT_FRAGMENT_NODE      = 11;
	this.NOTATION_NODE               = 12;

	/**
		Atributo privado:  countID
		@datatype: Integer
	*/
	this.countID = 0;

	/**
		Metodo publico: isDefaultAttr
		@params:
			AttrName - String
		@returns: Array | null
	*/
	this.isDefaultAttr = function (AttrName){
		if(AttrName=="type") return new Array("type","text");
		// agregar otros atributos por defecto
		return null;
	}

	/**
		Metodo publico: changeInputType
		@params:
			oldObject - Object,  nativo
			oType - String
		@returns: Object, nativo
	*/
	this.changeInputType = function(oldObject, oType){
		var newObject = document.createElement('input');
		newObject.type = oType;
		if(oldObject.size) newObject.size = oldObject.size;
		if(oldObject.value) newObject.value = oldObject.value;
		if(oldObject.name) newObject.name = oldObject.name;
		if(oldObject.id) newObject.id = oldObject.id;
		if(oldObject.className) newObject.className = oldObject.className;
		if(oldObject.style.cssText) newObject.style.cssText = oldObject.style.cssText;

		oldObject.parentNode.replaceChild(newObject,oldObject);
		return newObject;
	}
	
	/**
		Metodo publico: DOMExeptionType
		@params:
			code - Integer
		@returns: String
	*/
	this.DOMExeptionType = function(code){
		var result = "ERROR: Debe pasar por parametros un numero entre 1 y 10";
		switch(code){
			case 1:{
				result = "INDEX_SIZE_ERR";
				break;
			}
			case 2:{
				result = "DOMSTRING_SIZE_ERR";
				break;
			}
			case 3:{
				result = "HIERARCHY_REQUEST_ERR";
				break;
			}
			case 4:{
				result = "WRONG_DOCUMENT_ERR";
				break;
			}
			case 5:{
				result = "INVALID_CHARACTER_ERR";
				break;
			}
			case 6:{
				result = "NO_DATA_ALLOWED_ERR";
				break;
			}
			case 7:{
				result = "NO_MODIFICATION_ALLOWED_ERR";
				break;
			}
			case 8:{
				result = "NOT_FOUND_ERR";
				break;
			}
			case 9:{
				result = "NOT_SUPPORTED_ERR";
				break;
			}
			case 10:{
				result = "INUSE_ATTRIBUTE_ERR";
				break;
			}
		}
		return result;
	}
}var sWebGl = new sWebGlobals();



/**
	Objeto para definir funciones demonio
	Demonios definidos:
		- findById
*/
var daemons = {
	// arreglo de parametros para pasar a la funcion demonio
	//
	params: null, 

	/**
		@firstThat
	*/

	// para saber si encontro un objeto en la busqueda firstThat
	//
	gol: false,

	// Busca un Node del documento sWeb que coincida con cierto id
	//
	findById: function(cursor){
		if(val = cursor.attributes){
			if(val = val.getNamedItem("id")){
				if(val.nodeValue == daemons.params){
					daemons.params = cursor;
					return true;
			}	}
		}return false;
	},

	// Busca un Attr del documento sWeb que coincida con cierto id interno
	//
	findAttrByInternalId: function(cursor){
		if(val = cursor.attributes){
			for(var i=0; i<val.nodes.length; i++){
				if(val.nodes[i].nodeId==daemons.params[0]){
					daemons.params[1] = cursor;
					return true;
			}	}
		}return false;
	},

	// Busca un Element del documento sWeb que coincida con cierto id interno
	//
	findElementByInternalId: function(cursor){
		if(cursor.nodeId == daemons.params[0]){
			daemons.params[1] = cursor;
			return true;
		}return false;
	},

	/**
		@forEach
	*/
	
	// Busca elementos tipo Node de un nodeName dado
	//
	findByName: function(cursor){
		var objType = cursor.nodeName.toString().toUpperCase();
		var srchExp = daemons.params[0].toString().toUpperCase();

		if(objType == srchExp || srchExp == "*"){
			daemons.params[1][daemons.params[1].length] = cursor;
		}
	}

}



/**
	Clase: sWebTree
	Clase para trabajar con el arbol de objetos sWeb
	@virtual
*/
function sWebTree(eventHandle)
{
	// Para no permitir que se creen instancias de esta clase utilizando su constructor 
	designTemplates.virtual(this);

	/**
		Atributo publico readonly: startPoint
		@datatype: Node (sWeb Node)
	*/
	try{
		var nodo = sWebGl.browserDocument.getElementsByTagName("body")[0];
		timer.start();
		this.startPoint = makeTree(nodo,null);
		if(events.onCreateSWebTree) events.fnCreateSWebTree(timer.stop()); // lanzo el evento onCreateSWebTree
	}catch(e){ alert(e.message); }

	/**
			Metodo privado: makeTree
		@params:
			nativeObj - Node (native)
			sWebObj - Node (sWeb Node)
		@returns: sWebObj -referencia al nodo raiz (body)
		@debugging
	*/
	function makeTree (nativeObj,sWebObj){
		// Creo el elemento sWeb en dependencia del tipo de elemento nativo
		var NewObj = null;
		switch(nativeObj.nodeType)
		{	
			case sWebGl.ELEMENT_NODE:{
				NewObj = new Element(nativeObj.nodeName,nativeObj);

				// Creo una nueva Lista de Atributos
				var attrLista = new NamedNodeMap();
				attrLista.nativeObj = nativeObj; // agrego el elemento noativo, que tiene la lista de atributos

				// Hack pq IE no reconoce el type y value de los inputs
				if(NewObj.nodeName=="INPUT"){
					attrLista.nodes.splice(attrLista.nodes.length, 0, new Attr("type",nativeObj.type));
					attrLista.length++;

					if(nativeObj.value){
						attrLista.nodes.splice(attrLista.nodes.length, 0, new Attr("value",nativeObj.value));
						attrLista.length++;
					}
				}

				// Hack para que IE reconozca el elemento style
				if(nativeObj.style.cssText){
					attrLista.nodes.splice(attrLista.nodes.length, 0, new Attr("style",nativeObj.style.cssText));
					attrLista.length++;
				}

				// Busco los atributos del elemento nativo y agrego a attrLista
				for(var i=0; i<nativeObj.attributes.length; i++){
					var atributo = nativeObj.attributes[i];
					if(
						atributo.specified && 
						atributo.nodeName!="type" && // solo para los inputs, posible bug
						atributo.nodeName!="value" && // solo para los inputs, posible bug
						atributo.nodeName!="style"
					){
						attribb = new Attr(atributo.nodeName,atributo.nodeValue);
						attribb.specified = true;
						attrLista.nodes.splice(attrLista.nodes.length, 0, attribb);
						attrLista.length++;
					}
				}

				// Copio atributos y demas propiedades del elemento nativo al elemento sWeb
				NewObj.attributes = attrLista;
				break;
			}

			case sWebGl.TEXT_NODE:{
				NewObj = new Text(nativeObj.nodeValue);
				NewObj.nativeObj = nativeObj; // linkeando el objeto nativo al nodo sWeb
				break;
			}

			case sWebGl.COMMENT_NODE:{
				NewObj = new Comment(nativeObj.nodeValue);
				break;
			}

			case sWebGl.DOCUMENT_NODE:{
				NewObj = new Document();
				break;
			}
		}

		// error si no se crea el nodo
		if(!NewObj){
			throw new Error("Nodo estandar no creado. \nNodo tipo: " + nativeObj.nodeType);
			return null;
		}

		// Agrego al padre (sWebObj, si no es null)
		if(sWebObj){
			NewObj.parentNode = sWebObj;
			sWebObj.childNodes.splice(sWebObj.childNodes.length,0,NewObj);
			
			// Lleno las propiedades firstChild y lastChild para el padre
			sWebObj.firstChild = sWebObj.childNodes.item(0);
			sWebObj.lastChild  = sWebObj.childNodes.item(sWebObj.childNodes.length-1);
		}

		// Proximo elemento del arbol
		for(var i=0; i<nativeObj.childNodes.length; i++)
		{
			var invalidNode = false;
			if( nativeObj.childNodes[i].nodeType == 3 ) { // buscando si es un nodo valido
				invalidNode = (nativeObj.childNodes[i].nodeValue.indexOf("\n")==0); // Para Firefox
				/** @noimplementado - implementar bien para Opera y para Chrome */
				if(nativeObj.childNodes[i].nodeValue.indexOf("\t")==2) invalidNode = true; // Para Opera, mal 
				if(nativeObj.childNodes[i].nodeValue == " ") invalidNode = true; // para IE
			}

			if(!invalidNode)
				makeTree(nativeObj.childNodes[i],NewObj); // recursividad, me paso a mi mismo (NewObj)
		}

		// Lleno las propiedades previousSibling y nextSibling para  mis hijos si los tengo
		for(var i=0; i<NewObj.childNodes.length && NewObj.childNodes.length>1; i++){
			if( NewObj.childNodes.item(i+1) )
				NewObj.childNodes.item(i).nextSibling = NewObj.childNodes.item(i+1);

			if( NewObj.childNodes.item(i-1) )
				NewObj.childNodes.item(i).previousSibling = NewObj.childNodes.item(i-1);
		}

		// Activo el evento onsWebTree Devuelvo el elemento raiz
		if(!sWebObj) return NewObj;
	}

	/**
		Atributo privado: countElem
		@datatype: Integer
	*/
	var countElem = 0;
	
	/**
		Atributo privado:  countAttr
		@datatype: Integer
	*/
	var countAttr = 0;

	/**
		Metodo privado: tab
		@params:
			space - Integer
		@returns: String
	*/
	function tab(space){
		var tabbed = new String("");
		for(var i=0;i<space;i++){
			tabbed += "--";
		}
		return tabbed;
	}

	/**
		Metodo privado: recursive
		@params:
			treeObj - Node (sWeb Node)
			space - Integer
			printdoc - Document
		@returns: none
	*/
	function recursive(treeObj,space,printdoc){
		// 1. muestra nombre del elemento
		printdoc.write(tab(space)+"<span style='color: blue;'>"+treeObj.nodeName+"</span>");
		printdoc.write("<span style='color: brown;'> ["+treeObj.nodeId+"]</span>");
		if(treeObj.nodeType==3)
			printdoc.write("<span style='color: magenta;'> - \""+treeObj.nodeValue+"\"</span><br/>");
		else printdoc.write("<br/>");
		countElem++; // aumento la cantidad de Elementos
		// 2. muestra lista de atributos
		if(treeObj.attributes && treeObj.attributes.length>0){
			for(var i=0;i<treeObj.attributes.length;i++){
				printdoc.write(tab(space)+"<span style='color: green;'>"+treeObj.attributes.item(i).nodeName+": </span>");
				printdoc.write("<span>"+treeObj.attributes.item(i).nodeValue+"</span>");
				printdoc.write("<span style='color: brown;'> ["+treeObj.attributes.item(i).nodeId+"]</span><br/>");
				countAttr++; // aumento la cantidad de Atributos
			}}
		// 3. incrementa space
		space++;
		// 4. va al elemento hijo
		for(var i=0; i<treeObj.childNodes.length; i++)
			recursive(treeObj.childNodes.item(i),space,printdoc);
	}

	/**
		Metodo publico: print
		@params: 
			start - Objeto sWeb
		@returns: none
	*/
	this.print = function (start){
		countElem=0;
		countAttr=0;
		start = start ? start : this.startPoint;
		var w = window.open();
		var d = w.document;
		d.open();
			recursive(start,0,d); // funcion recursiva
			d.write("<br/>");
			d.write("<span style='color: red;'>Elementos: "+countElem+"</span></br>");
			d.write("<span style='color: red;'>Atributos: "+countAttr+"</span></br>");
		d.close();
	}

	/**
		Metodo publico: forEach - recorre todo el arbol ejecutando una funcion en cada nodo
		@params: 
			functionAction - function
			cursor - Node | this.startPoint
			Nota: pasar el arrego de parametros a la variable daemons.params antes de llamar a la funcion
		@returns: none
	*/
	this.forEach = function(functionAction,cursor){
		cursor = cursor ? cursor : sWeb.startPoint;

		functionAction(cursor);
		for(var i=0; i<cursor.childNodes.length; i++)
			this.forEach(functionAction,cursor.childNodes.item(i));
	}

	/**
		Metodo publico: firstThat - recorre todo el arbol ejecutando una funcion hasta llegar a un Node especifico
		@params: 
			functionAction - function
			cursor - Node | this.startPoint
			finito - parametro "fantasma", no llenar nunca
			Nota: pasar el arrego de parametros a la variable daemons.params antes de llamar a la funcion
		@returns: none, si no se encuentra el elemento pone null en daemons.params
	*/
	this.firstThat = function(functionAction,cursor,finito){
		cursor = cursor ? cursor : sWeb.startPoint;

		daemons.gol = functionAction(cursor);
		for(var i=0; i<cursor.childNodes.length && !daemons.gol; i++){
			if(!daemons.gol) // poda ramas del arbol
				this.firstThat(functionAction,cursor.childNodes.item(i),true);
		}
		if(!finito && !daemons.gol) daemons.params=null;
	}
}



/**
	Clase: arrayMethods
	Implementacion de los metodos estandares para trabajar con arreglos
	@virtual
*/
function arrayMethods()
{
	// Para no permitir que se creen instancias de esta clase utilizando su constructor 
	designTemplates.virtual(this);

	/**
		Atributo privado: nodes
		@datatype: Array
	*/
	this.nodes = new Array();
	
	/**
		Atributo publico readonly: length
		@datatype: Integer
	*/
	this.length = 0;
	
	/**
		Metodo publico: concat
		@params:
			arrToJoin- Array
			Todos los Arrays que se necesite pasar por parametros
		@returns: Array
		@noimplementado faltan argumentos, puede dar errores
	*/
	this.concat = function(arrToJoin){
		return this.nodes.concat(arrToJoin);
	}
	
	/**
		Metodo publico: join
		@params: none
		@returns: String
	*/
	this.join = function(){
		return this.nodes.join(); 
	}
	
	/**
		Metodo publico: pop
		@params: none
		@returns: Cualquier tipo
	*/
	this.pop = function(){
		var returnvalue = this.nodes.pop();
		this.length = this.nodes.length;
		return returnvalue;
	}
	
	/**
		Metodo publico: push
		@params: 
			data - Cualquier tipo
		@returns: Integer
	*/
	this.push = function(data){
		var returnvalue = this.nodes.push(data);
		this.length = this.nodes.length;
		return returnvalue;
	}

	/**
		Metodo publico: reverse
		@params: none
		@returns: none
	*/
	this.reverse = function(){
		this.nodes.reverse();
	}
	
	/**
		Metodo publico: shift
		@params: none
		@returns: Cualquier tipo
	*/
	this.shift = function(){
		var returnvalue = this.nodes.shift();
		this.length = this.nodes.length;
		return returnvalue;
	}

	/**
		Metodo publico: slice
		@params: 
			posInicio - Integer
			posFinal - Integer
		@returns: Array
	*/
	this.slice = function(posInicio,posFinal){
		if (posFinal) return this.nodes.slice(posInicio,posFinal);
		else return this.nodes.slice(posInicio);
	}

	/**
		Metodo publico: splice
		@params: 
			index - Integer
			delindex - Integer
			element - Cualquier tipo
			Todos los elementos que se necesite pasar por parametros
		@returns: none
		@noimplementado faltan argumentos, puede dar errores
	*/
	this.splice = function (index,delindex,element){
		this.nodes.splice(index,delindex,element);
		this.length = this.nodes.length;
	}

	/**
		Metodo publico: sort
		@params: 
			sortby - Function
		@returns: none
	*/
	this.sort = function(sortby){
		if(sortby) this.nodes.sort(sortby);
		else this.nodes.sort();
	}

	/**
		Metodo publico: toString 
		@params: none
		@returns: String
	*/
	this.toString = function(){
		return this.nodes.toString();
	}

	/**
		Metodo publico: unshift 
		@params: 
			element - Cualquier tipo
			Todos los elementos que se necesite pasar por parametros
		@returns: Integer
		@noimplementado faltan argumentos, puede dar errores
	*/
	this.unshift = function(element){
		this.nodes.unshift(element);
		this.length = this.nodes.length;
		return this.length;
	}
}



/**
	Clase: sWeb
	@singletton
*/
function sWebBase() // extend sWebTree
{
	// Comprobando que el navegador soporte el estandar DOM
	if ( !(sWebGl.browserDocument.createElement && sWebGl.browserDocument.getElementsByTagName) )
		throw new Error("Este navegador no soporta el estandar DOM, sWeb no sera cargado. Por favor, utilice un navegador de ultima generacion");

	// Lleno el objeto doc
	doc = new Document();

	// lanzo el evento onPageLoad al cargarse la pagina
	if(events.onPageLoad) events.onPageLoad(); 

	// Para permitir solamente una instancia de esta clase
	designTemplates.singletton(this);

	sWebTree.call(this); // constructor de la superclase sWebTree
}



/********************************************************

	A partir de este punto, solo clases especificas del DOM
	y definidas por el consorcio W3C

*********************************************************/



//---------------------------------------------------------------------------------
//	Exception: DOMException
//---------------------------------------------------------------------------------
function DOMException (domExcptCode) 
{
	/**
		Atributo publico: code
		@datatype: String
	*/
	this.code = domExcptCode;
};



//---------------------------------------------------------------------------------
//	Interface: DOMImplementation
/**	@singletton	**/
//---------------------------------------------------------------------------------
function DOMImplementation ()
{
	// Para permitir solamente una instancia de esta clase
	designTemplates.singletton(this);

	/**
		Metodo publico: hasFeature
		@params:
			feature - String
			version - String
		@returns: Boolean
	*/
	this.hasFeature = function(feature, version){
		return sWebGl.browserDocument.implementation.hasFeature(feature, version);
	}
}



//---------------------------------------------------------------------------------
//	Interface: DocumentFragment extend Node
//---------------------------------------------------------------------------------
function DocumentFragment () // extend Node
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.DOCUMENT_FRAGMENT_NODE; // defino el tipo de nodo
	this.nodeName = new String("#document-fragment");
	this.nativeObj = sWebGl.browserDocument.createElement("span");//createDocumentFragment();
}



//---------------------------------------------------------------------------------
//	Main Interface: Document extend Node
/**	@singletton	**/
//---------------------------------------------------------------------------------
function Document () // extend Node
{
	// Para permitir solamente una instancia de esta clase
	designTemplates.singletton(this);

	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.DOCUMENT_NODE; // defino el tipo de nodo
	this.nodeName = new String("#document");

	/**
		Atributo publico readonly: implementation
		@datatype: DOMImplementation
	*/
	this.implementation = new DOMImplementation();
	
	/**
		Atributo publico readonly: doctype 
		@datatype: DocumentType
		@noimplementado: Completar con la lista de parametros
	*/
	this.doctype = new DocumentType(/*parametros*/);
	
	/**
		Atributo publico readonly: documentElement  
		@datatype: Element
	*/
	this.documentElement = sWebGl.browserDocument.getElementsByTagName("HTML")[0];

	/**
		Metodo publico: createAttribute
		@params 
			name - String
		@returns: Attr
		@exceptions:
			INVALID_CHARACTER_ERR
		@noimplementado: Buscar como saber si tiene caracteres especiales
	*/
	this.createAttribute = function(name){
		if(false) 
			throw new DOMException(sWebGl.INVALID_CHARACTER_ERR); // si name contiene caracteres incorrectos

		return new Attr(name, "");
	}

	/**
		Metodo publico: createCDATASection
		@params 
			data - String
		@returns: CDATASection
		@exceptions:
			NOT_SUPPORTED_ERR
	*/
	this.createCDATASection = function(data){
		if(true) // Raised if this document is an HTML document. Esto siempre ocurrira
			throw new DOMException(sWebGl.NOT_SUPPORTED_ERR);

		return new CDATASection(data);
	}

	/**
		Metodo publico: createComment
		@params 
			data - String
		@returns: Comment
		@exceptions: None
	*/
	this.createComment = function(data){
		return new Comment(data);
	}

	/**
		Metodo publico: createDocumentFragment
		@params: None
		@returns: DocumentFragment
		@exceptions: None
	*/
	this.createDocumentFragment = function(){
		return new DocumentFragment();
	}

	/**
		Metodo publico: createElement
		@params 
			tagName - String
		@returns: Element
		@exceptions: 
			INVALID_CHARACTER_ERR
		@noimplementado: Lanzar la excepcion
	*/
	this.createElement = function(tagName){
		if(false) // si tagName contiene caracteres incorrectos
			throw new DOMException(sWebGl.INVALID_CHARACTER_ERR); 

		var natObj = sWebGl.browserDocument.createElement(tagName);
		return new Element(tagName,natObj);
	}

	/**
		Metodo publico: createEntityReference
		@params 
			name - String
		@returns: EntityReference
		@exceptions: 
			INVALID_CHARACTER_ERR
			NOT_SUPPORTED_ERR
		@noimplementado:  Lanzar la excepcion
	*/
	this.createEntityReference = function(name){
		if(true) // Raised if this document is an HTML document. Esto siempre ocurrira
			throw new DOMException(sWebGl.NOT_SUPPORTED_ERR);

		if(false) // si name contiene caracteres incorrectos
			throw new DOMException(sWebGl.INVALID_CHARACTER_ERR); 

		return new EntityReference(name);
	}

	/**
		Metodo publico: createProcessingInstruction
		@params 
			target - String
			data - String
		@returns: ProcessingInstruction
		@exceptions: 
			INVALID_CHARACTER_ERR
			NOT_SUPPORTED_ERR
		@noimplementado: Terminar excepciones 
	*/
	this.createProcessingInstruction = function(target,data){
		if(true) // Raised if this document is an HTML document. Esto siempre ocurrira
			throw new DOMException(sWebGl.NOT_SUPPORTED_ERR);

		if(false) // si name contiene caracteres incorrectos
			throw new DOMException(sWebGl.INVALID_CHARACTER_ERR); 

		return new ProcessingInstruction(target,data);

	}

	/**
		Metodo publico: createTextNode
		@params 
			data - String
		@returns: Text
		@exceptions: None
	*/
	this.createTextNode = function(data){
		return new Text(data);
	}

	/**
		Metodo publico: getElementsByTagName
		@params 
			tagname - String
		@returns: NodeList
		@exceptions: None
	*/
	this.getElementsByTagName = function(tagname){ 
		daemons.params = new Array(tagname,new Array());
		sWeb.forEach(daemons.findByName);
		return new NodeList(daemons.params[1]);
	}

	/**
		Metodo publico: getElementById (Introduced in DOM Level 2)
		@params 
			strNodeId - String
		@returns: Element
		@exceptions: None
	*/
	this.getElementById = function(strNodeId){
		daemons.params = strNodeId;
		sWeb.firstThat(daemons.findById);
		return daemons.params;
	}
}



//---------------------------------------------------------------------------------
//	Interface: Node
/**	@virtual	*/
//---------------------------------------------------------------------------------
function Node ()
{
	// Para no permitir que se creen instancias de esta clase utilizando su constructor 
	designTemplates.virtual(this);

	/**
		Atributo publico readonly: nodeId
		@datatype: Integer
		@nodomattribute
	*/
	this.nodeId = sWebGl.countID++; // defino un unico ID a cada Node
	
	/**
		Atributo publico readonly: nodeType
		@datatype: Integer
	*/
	this.nodeType = undefined;

	/**
		Atributo publico readonly: nodeName
		@datatype: String
	*/
	this.nodeName = null;

	/**
		Atributo publico readonly: nodeValue
		@datatype: String
	*/
	this.nodeValue = null;

	/**
		Atributo publico readonly: parentNode
		@datatype: Node
	*/
	this.parentNode = null;

	/**
		Atributo publico readonly: childNodes
		@datatype: NodeList
	*/
	this.childNodes = new NodeList(new Array());

	/**
		Atributo publico readonly: firstChild
		@datatype: Node
	*/
	this.firstChild = null;

	/**
		Atributo publico readonly: lastChild
		@datatype: Node
	*/
	this.lastChild = null;

	/**
		Atributo publico readonly: previousSibling
		@datatype: Node
	*/
	this.previousSibling = null;
	
	/**
		Atributo publico readonly: nextSibling
		@datatype: Node
	*/
	this.nextSibling = null;
	
	/**
		Atributo publico readonly: attributes
		@datatype: NamedNodeMap
	*/
	this.attributes = null;

	/**
		Atributo publico readonly: ownerDocument
		@datatype: Document
	*/
	this.ownerDocument = doc;

	/**
		Metodo publico: appendChild
		@params 
			newChild - Node
		@returns: Node
		@exceptions: 
			HIERARCHY_REQUEST_ERR
			WRONG_DOCUMENT_ERR
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.appendChild = function(newChild){
		// para saber si el Node newChild es ancestor del Node this. Si lo es lanzo una excepcion
		var father = this;
		while(father){
			if(father==newChild)
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
			father = father.parentNode;
		}

		// hay elementos que no pueden ser padres. Lanzo una excepcion si se especifican
		switch(this.nodeType){
			case sWebGl.TEXT_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}

			case sWebGl.ATTRIBUTE_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}

			case sWebGl.COMMENT_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}
		}

		// convierto a mayusculas el nodeName
		if(newChild.nodeType == sWebGl.ELEMENT_NODE)
			newChild.nodeName = newChild.nodeName.toUpperCase();

		// comprobando que el nodo no exista en el arbol y si existe lo elimino antes de incluirlo
		daemons.params = new Array(newChild.nodeId,null);
		sWeb.firstThat(daemons.findElementByInternalId);
		if(daemons.params){
			newChild = daemons.params[1].parentNode.removeChild(daemons.params[1]);
		}

		// agrego el elemento al arbol
		if(newChild instanceof DocumentFragment) // si lo que se intenta agregar es un DocumentFragment, se agregan su lista de hijos
		{
			// conectamendo los nuevos hermanos 
			this.lastChild.nextSibling = newChild.firstChild;
			newChild.firstChild.previousSibling = this.lastChild;
			// concatenando con el nuevo padre
			for(var i=0; i<newChild.childNodes.length; i++)	
				newChild.childNodes.item(i).parentNode = this;
			// concatenando ambos arreglos
			this.childNodes.nodes = this.childNodes.nodes.concat(newChild.childNodes.nodes);
			this.childNodes.length = this.childNodes.nodes.length;
			// configurando el nuevo ultimo hijo
			this.lastChild = this.childNodes.nodes[this.childNodes.length-1];
		}
		else // si no se agrega un DocumentFragment, sino un nodo comun
		{
			if( this.hasChildNodes() )
			{
				this.lastChild.nextSibling = newChild;
				newChild.previousSibling = this.lastChild;
			}else{
				this.firstChild = newChild;
			}
			this.childNodes.nodes.splice(this.childNodes.length, 0, newChild);
			this.childNodes.length++;
			newChild.parentNode = this;
			this.lastChild = this.childNodes.item(this.childNodes.length-1);
		}

		// llamando a la rutina nativa del navegador para incluir un nodo en el documento
		var nativeChild = null;
		switch(newChild.nodeType)
		{	
			case sWebGl.ELEMENT_NODE:{
				nativeChild = newChild.nativeObj;
				break;
			}

			case sWebGl.DOCUMENT_FRAGMENT_NODE:{
				nativeChild = newChild.nativeObj;
				break;
			}

			case sWebGl.TEXT_NODE:{
				nativeChild = sWebGl.browserDocument.createTextNode(newChild.nodeValue);
				break;
			}

			case sWebGl.COMMENT_NODE:{
				nativeChild = sWebGl.browserDocument.createComment(newChild.nodeValue);
				break;
			}

		}
		this.nativeObj.appendChild(nativeChild);

		return newChild;
	}
	
	/**
		Metodo privado: cloneNodeTree
		@params:
			cursor - Element, inicio del arbol a clonar
			deep  - Boolean
			father - Element | null
		@returns: referencia al elmento clonado
		@nodomattribute
	*/
	function cloneNodeTree (cursor,deep,father){
		// clono el Element cursor a la variable cloneElem en dependencia del tipo de Node
		var cloneElem = null;
		switch(cursor.nodeType)
		{	
			case sWebGl.ATTRIBUTE_NODE:{
				return new Attr(cursor.nodeName,cursor.nodeValue);
				break;
			}

			case sWebGl.ELEMENT_NODE:{
				var nativeClone = cursor.nativeObj.cloneNode(deep);
				var cloneElem = new Element(cursor.nodeName,nativeClone);

				var attrList = new NamedNodeMap();
				for(var i=0; i<cursor.attributes.length; i++){
					var attrb = cursor.attributes.item(i);
					attrb = new Attr(attrb.nodeName, attrb.nodeValue);
					attrList.nodes.splice(attrList.nodes.length, 0, attrb);
					attrList.length++;
				}
				cloneElem.attributes = attrList;
				break;
			}

			case sWebGl.TEXT_NODE:{
				cloneElem = new Text(cursor.nodeValue);
				break;
			}

			case sWebGl.COMMENT_NODE:{
				cloneElem = new Comment(cursor.nodeValue);
				break;
			}

			case sWebGl.DOCUMENT_NODE:{
				cloneElem = new Document();
				break;
			}
			
			default: {
				throw new Error("No es posible clonar el Node de tipo: " + cursor.nodeType);
				return null;
			}
		}

		// si no se especifica una clonacion en profundidad retorno el elemento clonado
		if(!deep) return cloneElem;

		if(father){ // Agrego al padre si father no es null (si no es el primer nodo)
			cloneElem.parentNode = father;
			father.childNodes.splice(father.childNodes.length,0,cloneElem);

			// Lleno las propiedades firstChild y lastChild para el padre
			father.firstChild = father.childNodes.item(0);
			father.lastChild = father.childNodes.item(father.childNodes.length-1);
		}

		// Proximo elemento del arbol
		for(var i=0; i<cursor.childNodes.length; i++)
			cloneNodeTree(cursor.childNodes.item(i),deep,cloneElem);

		// Lleno las propiedades previousSibling y nextSibling para  mis hijos si los tengo
		for(var i=0; i<cloneElem.childNodes.length && cloneElem.childNodes.length>1; i++)
		{
			if( cloneElem.childNodes.item(i+1) )
				cloneElem.childNodes.item(i).nextSibling = cloneElem.childNodes.item(i+1);

			if( cloneElem.childNodes.item(i-1) )
				cloneElem.childNodes.item(i).previousSibling = cloneElem.childNodes.item(i-1);
		}

		// Devuelvo el elemento clonado con todos sus hijos
		if(!father) return cloneElem;
	}	

	/**
		Metodo publico: cloneNode
		@params 
			deep  - Boolean
		@returns: Node
		@exceptions: None
	*/
	this.cloneNode = function(deep){
		return cloneNodeTree(this,deep);
	}

	/**
		Metodo publico: hasAttributes (introduced in DOM Level 2)
		@params 
		@returns: Boolean
		@exceptions: 
	*/
	this.hasAttributes = function(){
		return this.attributes.length > 0;
	}

	/**
		Metodo publico: hasChildNodes
		@params: None
		@returns: Boolean
		@exceptions: None
	*/
	this.hasChildNodes = function(){
		return this.childNodes.length > 0;
	}	

	/**
		Metodo publico: insertBefore
		@params 
			newChild - Node
			refChild - Node
		@returns: Node
		@exceptions: 
			HIERARCHY_REQUEST_ERR
			WRONG_DOCUMENT_ERR
			NO_MODIFICATION_ALLOWED_ERR
			NOT_FOUND_ERR
	*/
	this.insertBefore = function(newChild,refChild){
		// para saber si el Node newChild es ancestor del Node this. Si lo es lanzo una excepcion
		var father = this;
		while(father){
			if(father==newChild)
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
			father = father.parentNode;
		}

		// hay elementos que no pueden ser padres. Lanzo una excepcion si se especifican
		switch(this.nodeType){
			case sWebGl.TEXT_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}

			case sWebGl.ATTRIBUTE_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}

			case sWebGl.COMMENT_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
		}	}

		// comprobando que el nodo no exista en el arbol y si existe lo elimino antes de incluirlo
		daemons.params = new Array(newChild.nodeId,null);
		sWeb.firstThat(daemons.findElementByInternalId);
		if(daemons.params){
			newChild = daemons.params[1].parentNode.removeChild(daemons.params[1]);
		}
		
		// convierto a mayusculas el nodeName
		if(newChild.nodeType == sWebGl.ELEMENT_NODE)
			newChild.nodeName = newChild.nodeName.toUpperCase();

		if(!refChild){ // si no se especifica refChild inserto al final de la lista de hijos
			this.lastChild.nextSibling = newChild;
			newChild.previousSibling = this.lastChild;
			this.lastChild = newChild;
			this.childNodes.nodes.splice(this.childNodes.length,0,newChild);
			this.childNodes.length++;
			newChild.parentNode = this;
			// ejecuto la operacion para el objeto nativo
			this.nativeObj.insertBefore(newChild.nativeObj,null);
			return newChild;
		}

		// calculo la  posicion del hijo delante del cual insertar
		var childPos = -1;
		for(var i=0; i<this.childNodes.length; i++){
			if( this.childNodes.item(i)==refChild ){
				childPos = i; break;
			}
		}

		// si no se encuentra el hijo de referencia, lanzo una excepcion
		if (childPos<0) throw new DOMException(sWebGl.NOT_FOUND_ERR);

		// agrego el elemento al arbol
		if( this.hasChildNodes() )
		{
			if(childPos==0){
				this.firstChild.previousSibling = newChild;
				newChild.nextSibling = this.firstChild;
				this.firstChild = newChild;
				
			}

			if(childPos==this.childNodes.length-1){
				this.lastChild.nextSibling = newChild;
				newChild.previousSibling = this.lastChild;
				this.lastChild = newChild;
			}

			if(childPos>0 && childPos<this.childNodes.length-1){
				this.childNodes.item(childPos).previousSibling = newChild;
				newChild.nextSibling = this.childNodes.item(childPos);
				this.childNodes.item(childPos-1).nextSibling = newChild;
				newChild.previousSibling = this.childNodes.item(childPos-1);
			}
		}
		
		// agrega el Node al arbol
		this.childNodes.nodes.splice(childPos,0,newChild);
		this.childNodes.length++;
		newChild.parentNode = this;
		this.firstChild = this.childNodes.item(0);
		this.lastChild  = this.childNodes.item(this.childNodes.length-1);		

		// ejecuto la operacion para el objeto nativo
		this.nativeObj.insertBefore(newChild.nativeObj,refChild.nativeObj);
		
		return newChild;
	}

	/**
		Metodo publico: removeChild
		@params 
			oldChild  - Node
		@returns: Node
		@exceptions: 
			NO_MODIFICATION_ALLOWED_ERR
			NOT_FOUND_ERR
	*/
	this.removeChild = function(oldChild){
		//calculo la  posicion del hijo a borrar
		var childPos = -1;
		for(var i=0; i<this.childNodes.length; i++){
			if( this.childNodes.item(i)==oldChild ){
				childPos = i; break;
			}
		} 

		// si no se encuentra el hijo a borrar
		if (childPos<0) throw new DOMException(sWebGl.NOT_FOUND_ERR); 

		// modifico el vinculo contre los hermanos - si esta en el medio de la lista de hermanos
		if(oldChild.nextSibling && oldChild.previousSibling){
			oldChild.nextSibling.previousSibling = oldChild.previousSibling;
			oldChild.previousSibling.nextSibling = oldChild.nextSibling;
		}

		// modifico el vinculo contre los hermanos - si es el primero de la lista
		if(oldChild.nextSibling && !oldChild.previousSibling){
			oldChild.nextSibling.previousSibling = null;
		}

		// modifico el vinculo contre los hermanos - si es el ultimo de la lista
		if(!oldChild.nextSibling && oldChild.previousSibling){
			oldChild.previousSibling.nextSibling = null;

		}
		// elimino el vinculo del hijo con el padre y los hermanos
		oldChild.parentNode = null;
		oldChild.nextSibling = null;
		oldChild.previousSibling = null;

		// elimino el Node de la lista de hijos del padre
		var arrAttr = new Array(); var s = 0;
		for(var j=0; j<this.childNodes.length; j++){
			if(j!=i){
				arrAttr[s] = this.childNodes.item(j);
				s++;
			}
		}
		this.childNodes.nodes = arrAttr;
		this.childNodes.length--; 

		// modifico los atributos firstChild y lastChild
		this.firstChild = this.childNodes.item(0);
		this.lastChild  = this.childNodes.item(this.childNodes.length-1);

		// elimino el hijo del DOM nativo
		this.nativeObj.removeChild(oldChild.nativeObj);
		return oldChild;
	}

	/**
		Metodo publico: replaceChild
		@params 
			newChild - Node
			oldChild  - Node
		@returns: Node
		@exceptions: 
			HIERARCHY_REQUEST_ERR
			WRONG_DOCUMENT_ERR
			NO_MODIFICATION_ALLOWED_ERR
			NOT_FOUND_ERR
	*/
	this.replaceChild = function(newChild,refChild){
		// para saber si el Node newChild es ancestor del Node this. Si lo es lanzo una excepcion
		var father = this;
		while(father){
			if(father==newChild)
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
			father = father.parentNode;
		}

		// hay elementos que no pueden ser padres. Lanzo una excepcion si se especifican
		switch(this.nodeType){
			case sWebGl.TEXT_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}

			case sWebGl.ATTRIBUTE_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
			}

			case sWebGl.COMMENT_NODE:{
				throw new DOMException(sWebGl.HIERARCHY_REQUEST_ERR);
				break;
		}	}

		// comprobando que el nodo no exista en el arbol y si existe lo elimino antes de incluirlo
		daemons.params = new Array(newChild.nodeId,null);
		sWeb.firstThat(daemons.findElementByInternalId);
		if(daemons.params){
			newChild = daemons.params[1].parentNode.removeChild(daemons.params[1]);
		}
		
		// convierto a mayusculas el nodeName
		if(newChild.nodeType == sWebGl.ELEMENT_NODE)
			newChild.nodeName = newChild.nodeName.toUpperCase();

		// calculo la  posicion del hijo a reemplazar
		var childPos = -1;
		for(var i=0; i<this.childNodes.length; i++){
			if( this.childNodes.item(i)==refChild ){
				childPos = i; break;
			}
		} 

		// si no se encuentra el hijo de referencia, lanzo una excepcion
		if (childPos<0) throw new DOMException(sWebGl.NOT_FOUND_ERR);

		// agrego el elemento al arbol
		if( this.hasChildNodes() )
		{
			if(childPos==0){
				this.firstChild.nextSibling.previousSibling = newChild;
				newChild.nextSibling = this.firstChild.nextSibling;
				this.firstChild = newChild;
			}

			if(childPos==this.childNodes.length-1){
				this.lastChild.previousSibling.nextSibling = newChild;
				newChild.previousSibling = this.lastChild.previousSibling;
				this.lastChild = newChild;
			}

			if(childPos>0 && childPos<this.childNodes.length-1){
				this.childNodes.item(childPos).previousSibling.nextSibling = newChild;
				this.childNodes.item(childPos).nextSibling.previousSibling = newChild;
				newChild.nextSibling = this.childNodes.item(childPos).nextSibling;
				newChild.previousSibling = this.childNodes.item(childPos).previousSibling;
			}
		}
		
		// agrega el Node al arbol
		this.childNodes.nodes.splice(childPos,1,newChild);
		newChild.parentNode = this;
		this.firstChild = this.childNodes.item(0);
		this.lastChild  = this.childNodes.item(this.childNodes.length-1);		

		// ejecuto la operacion para el objeto nativo
		this.nativeObj.replaceChild(newChild.nativeObj,refChild.nativeObj);

		return newChild;
	}
}



//---------------------------------------------------------------------------------
//	Interface: NodeList
//---------------------------------------------------------------------------------
function NodeList (nodesArray)
{
	// No debe crearse un NodeList sin pasar un arreglo por parametros
	if(!(nodesArray instanceof Array)) 
		throw new Error("Para crear una NodeList debe pasar un Array al constructor");

	// Agrego las funciones estandar para la manipulacion de cadenas
	arrayMethods.call(this);

	/**
		Atributo publico: nodes
		@datatype: Array
	*/
	this.nodes = nodesArray;

	/**
		Atributo publico readonly: length
		@datatype: Integer
	*/
	this.length = this.nodes.length;

	/**
		Metodo publico: item
		@params 
			index  - Integer
		@returns: Node | null
		@exceptions: None
	*/
	this.item = function(index){
		return this.nodes[index] || null;
	}
}



//---------------------------------------------------------------------------------
//	Interface: NamedNodeMap
//---------------------------------------------------------------------------------
function NamedNodeMap ()
{
	// Agrego las funciones estandar para la manipulacion de cadenas
	arrayMethods.call(this);
	
	/**
		Atributo publico readonly: nativeObj
		@datatype: Object
		@nodomattribute
	*/
	this.nativeObj = null; // instancia de la lista nativa

	/**
		Atributo privado: this.nodes
		@datatype: Array
	*/
	this.nodes = new Array();

	/**
		Atributo publico readonly: length
		@datatype: Integer
	*/
	this.length = 0;

	/**
		Metodo publico: item
		@params 
			index  - Integer
		@returns: Node | null
		@exceptions: None
	*/	
	this.item = function(index){
		return this.nodes[index] || null;
	}

	/**
		Metodo publico: getNamedItem
		@params 
			name  - String
		@returns: Node | null
		@exceptions: None
	*/
	this.getNamedItem = function(name){
		for(var i=0; i<this.nodes.length; i++){	
			if( this.nodes[i].nodeName==name ) return this.nodes[i];
		}return null;
	}

	/**
		Metodo publico: removeNamedItem
		@params 
			name  - String
		@returns: Node
		@exceptions: 
			NOT_FOUND_ERR
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.removeNamedItem = function(name){
		for(var i=0; i<this.nodes.length; i++){
			if( this.nodes[i].nodeName==name ){
				var temp = this.nodes[i];
				this.nodes.splice(i, 1);
				this.length--;
				this.nativeObj.removeAttribute(name); // borro del DOM nativo
				return temp;
			}
		}
		throw new DOMException(sWebGl.NOT_FOUND_ERR); // no se encuentra el nodo a borrar
	}

	/**
		Metodo publico: setNamedItem
		@params 
			arg  - Node
		@returns: Node | null
		@exceptions: 
			WRONG_DOCUMENT_ERR
			NO_MODIFICATION_ALLOWED_ERR
			INUSE_ATTRIBUTE_ERR
	*/
	this.setNamedItem = function(arg){
		// agrego el atributo al elemento nativo 
		if(arg.nodeName == "style") // hack para que IE cambie el elemento style
			this.nativeObj.style.cssText = arg.nodeValue;
		else{
			if(arg.nodeName=="type" && this.nativeObj.nodeName=="INPUT") // hack para que IE cambie el type de un INPUT
				this.nativeObj = sWebGl.changeInputType(this.nativeObj, arg.nodeValue);
			else
				this.nativeObj.setAttribute(arg.nodeName,arg.nodeValue); // agrego al DOM nativo
		}

		// agrego el atributo al arbol sWeb
		for(var i=0; i<this.nodes.length; i++){
			if(this.nodes[i].nodeName.sub() == arg.nodeName.sub()){
				var temp = this.nodes[i];
				this.nodes[i] = arg;
				return temp;
			}
		}
		this.nodes.splice(this.nodes.length, 0, arg);
		this.length++;
		return null;
	}
}



//---------------------------------------------------------------------------------
//	Interface: CharacterData extend Node
//---------------------------------------------------------------------------------
function CharacterData () //extend Node
{
	Node.call(this); // constructor de la superclase
	/**
		Atributo publico readonly: nativeObj
		@datatype: Object
		@nodomattribute
	*/
	this.nativeObj = null; // instancia del elemento nativo en el Node

	/**
		Atributo publico readonly: data
		@datatype: String
	*/
	this.data = new String();
	
	/**
		Atributo publico readonly: length
		@datatype: Integer
	*/
	this.length = this.data.length;

	/**
		Metodo publico: appendData
		@params 
			arg  - String
		@returns: None
		@exceptions: 
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.appendData = function (arg){
		this.data += arg;
		this.nodeValue += arg;
		this.length = this.data.length;
		this.nativeObj.appendData(arg); // realizo la operacion en el nodo nativo
	}

	/**
		Metodo publico: deleteData
		@params 
			offset  - Integer
			count - Integer
		@returns: None
		@exceptions: 
			INDEX_SIZE_ERR
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.deleteData = function (offset,count){
		if(offset<0 || count<0 || offset>this.length) 
			throw new DOMException(sWebGl.INDEX_SIZE_ERR);

		var arr = this.data.split("");
		arr.splice(offset,count);

		var str = new String();
		for(var i=0; i<arr.length; i++)
			str += arr[i];

		this.data = str
		this.nodeValue = str
		this.length = str.length;

		this.nativeObj.deleteData(offset,count); // realizo la operacion en el nodo nativo
	}

	/**
		Metodo publico: insertData
		@params 
			offset  - Integer
			arg  - String
		@returns: None
		@exceptions: 
			INDEX_SIZE_ERR
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.insertData = function (offset,arg){
		if(offset<0 || offset>this.length) 
			throw new DOMException(sWebGl.INDEX_SIZE_ERR);

		var arr = this.data.split("");
		arr.splice(offset,0,arg);

		var str = new String();
		for(var i=0; i<arr.length; i++)
			str += arr[i];

		this.data = str
		this.nodeValue = str
		this.length = str.length;

		this.nativeObj.insertData(offset,arg); // realizo la operacion en el nodo nativo
	}

	/**
		Metodo publico: replaceData
		@params 
			offset  - Integer
			count - Integer
			arg - String
		@returns: String
		@exceptions: 
			INDEX_SIZE_ERR
			DOMSTRING_SIZE_ERR
	*/
	this.replaceData = function (offset,count,arg){
		if(offset<0 || count<0 || offset>this.length) 
			throw new DOMException(sWebGl.INDEX_SIZE_ERR);

		var arr = this.data.split("");
		arr.splice(offset,count,arg);

		var str = new String();
		for(var i=0; i<arr.length; i++)
			str += arr[i];

		this.data = str
		this.nodeValue = str
		this.length = str.length;

		this.nativeObj.replaceData(offset,count,arg); // realizo la operacion en el nodo nativo
	}

	/**
		Metodo publico: substringData
		@params 
			offset  - Integer
			count - Integer
		@returns: String
		@exceptions: 
			INDEX_SIZE_ERR
			DOMSTRING_SIZE_ERR
	*/
	this.substringData = function (offset,count){
		if(offset<0 || count<0 || offset>this.length) 
			throw new DOMException(sWebGl.INDEX_SIZE_ERR);

		return this.data.substr(offset,count);
	}
}



//---------------------------------------------------------------------------------
//	Interface: Attr extend Node
//---------------------------------------------------------------------------------
function Attr (pname,pvalue) // extend Node
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.ATTRIBUTE_NODE; // defino el tipo de nodo

	/**
		Atributo publico readonly: nativeObj
		@datatype: Object
		@nodomattribute
	
	this.nativeObj = null; // instancia de la lista nativa	
	*/
	/**
		Atributo publico readonly: name
		@datatype: String
	*/
	this.name = new String(pname);
	this.nodeName = new String(pname);

	/**
		Atributo publico readonly: specified
		@datatype: Boolean
	*/
	this.specified = false;

	/**
		Atributo publico: value 
		@datatype: String
	*/
	this.value = new String(pvalue);
	this.nodeValue = new String(pvalue);
}



//---------------------------------------------------------------------------------
//	Interface: Element extend Node
//---------------------------------------------------------------------------------
function Element (ptagname,nativeDOMObj) //extend Node
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.ELEMENT_NODE; // defino el tipo de nodo
	this.attributes = new NamedNodeMap(); // lista de atributos vacia al inicio
	this.attributes.nativeObj = nativeDOMObj; // agrego el elemento noativo, que tiene la lista de atributos
	this.nodeName = new String(ptagname);

	switch( ptagname.toUpperCase() ){ 	//Poniendo atributos por defecto
		case "INPUT": {
			this.attributes.nodes.splice(this.attributes.nodes.length, 0, new Attr("type","text"));
			this.attributes.length++;
			break;
		}
	}

	/**
		Atributo publico readonly: nativeObj
		@datatype: Object
		@nodomattribute
	*/
	this.nativeObj = nativeDOMObj; // instancia del elemento nativo en el Node

	/**
		Atributo publico readonly: tagName  
		@datatype: String
	*/
	this.tagName = new String(ptagname);

	/**
		Metodo publico: getAttribute
		@params 
			name - String
		@returns: String // valor del atributo o "" en caso de no tener valor
		@exceptions: None
	*/
	this.getAttribute = function (name){
		var attrib = this.attributes.getNamedItem(name);
		return attrib ? attrib.nodeValue : "";
	}

	/**
		Metodo publico: getAttributeNode
		@params 
			name - String
		@returns: Attr | null
		@exceptions: None
	*/
	this.getAttributeNode = function (name){
		return this.attributes.getNamedItem(name);
	}

	/**
		Metodo publico: getElementsByTagName
		@params 
			name - String
		@returns: NodeList
		@exceptions: None
	*/
	this.getElementsByTagName = function (name){
		daemons.params = new Array(name,new Array());
		sWeb.forEach(daemons.findByName,this);
		return new NodeList(daemons.params[1]);
	}

	/**
		Metodo publico: removeAttribute
		@params 
			name - String
		@returns: None
		@exceptions: 
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.removeAttribute = function (name){
		// eliminando
		this.attributes.removeNamedItem(name);

		// si es un atributo por defecto
		if( ret=sWebGl.isDefaultAttr(name) ){
			var attrib = new Attr(ret[0],ret[1]);
			this.attributes.nodes.splice(this.attributes.nodes.length, 0, attrib);
			this.attributes.length++;
		}
	}

	/**
		Metodo publico: removeAttributeNode
		@params 
			oldAttr  - Attr
		@returns: Attr 
		@exceptions: 
			NO_MODIFICATION_ALLOWED_ERR
			NOT_FOUND_ERR
	*/
	this.removeAttributeNode = function (oldAttr){
		// verificando que el atributo exista y sea parte del Elemento
		for(var i=0, isAttr=false; i<this.attributes.length; i++)
			if (this.attributes.item(i)==oldAttr) isAttr=true;
		if(!isAttr) throw new DOMException(sWebGl.NOT_FOUND_ERR);
		
		// eliminando
		var retvalue = this.attributes.removeNamedItem(oldAttr.nodeName);

		// si es un atributo por defecto
		if( ret=sWebGl.isDefaultAttr(oldAttr.nodeName) ){
			var attrib = new Attr(ret[0],ret[1]);
			this.attributes.nodes.splice(this.attributes.nodes.length, 0, attrib);
			this.attributes.length++;
		}

		return retvalue;
	}

	/**
		Metodo publico: setAttribute
		@params 
			name  - String
			value  - String
		@returns: None 
		@exceptions: 
			INVALID_CHARACTER_ERR
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.setAttribute = function (name,value){
		// si name contiene caracteres incorrectos
		if(false) throw new DOMException(sWebGl.INVALID_CHARACTER_ERR); 

		var newAttr = new Attr(name,value);
		this.attributes.setNamedItem(newAttr);
	}

	/**
		Metodo publico: setAttributeNode
		@params 
			newAttr  - Attr
		@returns: Attr 
		@exceptions: 
			WRONG_DOCUMENT_ERR
			NO_MODIFICATION_ALLOWED_ERR
			INUSE_ATTRIBUTE_ERR
	*/
	this.setAttributeNode = function (newAttr){
		// comprobando que el nodo no exista en el arbol y si existe lanzo una excepcion
		daemons.params = new Array(newAttr.nodeId,null);
		sWeb.firstThat(daemons.findAttrByInternalId);
		if(daemons.params) throw new DOMException(sWebGl.INUSE_ATTRIBUTE_ERR);

		// cambio el DOM nativo del browser
		this.attributes.setNamedItem(newAttr);

		// busco  si existe el atributo y en caso afirmativo lo sobreescribo
		for(var i=0; i<this.attributes.nodes.length; i++){
			var a = this.attributes.nodes[i].nodeName.toString();
			var b = newAttr.nodeName.toString();
			if(a==b){
				var oldAttr = this.attributes.nodes[i];
				this.attributes.nodes[i] = newAttr;
				return oldAttr;
			}
		}

		// sino existe, agrego el nuevo atributo
		this.attributes.nodes.splice(this.attributes.nodes.length, 0, newAttr);
		this.attributes.length++;
		return null;
	}
	
	/**
		Metodo publico: hasAttribute (Introduced in DOM Level 2)
		@params 
			name   - String
		@returns: Boolean 
		@exceptions: None
	*/
	this.hasAttribute = function (name){
		for(var i=0; i<this.attributes.length; i++)
			if (this.attributes.item(i).nodeName==name) return true;
		return false;
	}
}



//---------------------------------------------------------------------------------
//	Interface: Text extend CharacterData
//---------------------------------------------------------------------------------
function Text (ptextvalue) // extend CharacterData
{
	CharacterData.call(this); // constructor de la superclase
	this.nodeType = sWebGl.TEXT_NODE; // defino el tipo de nodo
	this.nodeName = new String("#text");
	this.nodeValue = new String(ptextvalue);
	this.data = new String(ptextvalue);
	this.length = this.data.length;

	/**
		Metodo publico: splitText
		@params 
			offset   - Integer
		@returns: Text
		@exceptions: 
			INDEX_SIZE_ERR
			NO_MODIFICATION_ALLOWED_ERR
	*/
	this.splitText = function (offset){
		if(offset<0 || offset>this.length) 
			throw new DOMException(sWebGl.INDEX_SIZE_ERR);

		var thisText = this.data.slice(0,offset);
		var newText  = this.data.slice(offset);

		this.data = thisText
		this.nodeValue = thisText
		this.length = thisText.length;

		// creo el nuevo texto y si tiene padre lo agrego como nodo hermano (sibling) al arbol
		var newTextObj = new Text(newText);

		if(this.parentNode){
			// lo agrego al arbol
			var count = this.parentNode.childNodes.length;
			this.parentNode.childNodes.nodes.splice(count,0,newTextObj);
			this.parentNode.childNodes.length++;
			// linqueo con los hermanos
			this.parentNode.childNodes.nodes[count-1].nextSibling = newTextObj;
			newTextObj.previousSibling = this.parentNode.childNodes.nodes[count];
			//linkeo con el padre
			newTextObj.parentNode = this.parentNode;
		}
		return newTextObj;
	}
}



//---------------------------------------------------------------------------------
//	Interface: Comment extend CharacterData
//---------------------------------------------------------------------------------
function Comment (pcomment) // extend CharacterData
{
	CharacterData.call(this); // constructor de la superclase
	this.nodeType = sWebGl.COMMENT_NODE; // defino el tipo de nodo
	this.nodeName = new String("#comment");
	this.nodeValue = new String(pcomment);
}



//---------------------------------------------------------------------------------
//	Interface: CDATASection  extend Text
//---------------------------------------------------------------------------------
function CDATASection (pCdatavalue) // extend Text
{
	Text.call(this); // constructor de la superclase
	this.nodeType = sWebGl.CDATA_SECTION_NODE; // defino el tipo de nodo
	this.nodeName = new String("#cdata-section");
	this.nodeValue = new String(pCdatavalue);
}



//---------------------------------------------------------------------------------
//	Interface: DocumentType  extend Node 
/** 	@singletton	*/
//---------------------------------------------------------------------------------
function DocumentType (pname,pentities,pnotations) // extend Node 
{
	// Para permitir solamente una instancia de esta clase
	designTemplates.singletton(this);

	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.DOCUMENT_TYPE_NODE; // defino el tipo de nodo
	this.nodeName = new String(pname);

	/**
		Atributo publico readonly: name  
		@datatype: String
	*/
	this.name = new String(pname);

	/**
		Atributo publico readonly: entities   
		@datatype: NamedNodeMap
	*/
	this.entities = pentities;

	/**
		Atributo publico readonly: notations    
		@datatype: NamedNodeMap
	*/
	this.notations = pnotations;
}



//---------------------------------------------------------------------------------
//	Interface: Notation  extend Node 
//---------------------------------------------------------------------------------
function Notation (pnotationname) // extend Node 
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.NOTATION_NODE; // defino el tipo de nodo
	this.nodeName = new String(pnotationname);

	/**
		Atributo publico readonly: publicId  
		@datatype: String
	*/
	this.publicId = null;

	/**
		Atributo publico readonly: systemId   
		@datatype: String
	*/
	this.systemId = null;
}



//---------------------------------------------------------------------------------
//	Interface: Entity  extend Node 
//---------------------------------------------------------------------------------
function Entity (entityname) // extend Node 
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.ENTITY_NODE; // defino el tipo de nodo
	this.nodeName = new String(entityname);
	

	/**
		Atributo publico readonly: publicId  
		@datatype: String
	*/
	this.publicId = new String(ppublicId);

	/**
		Atributo publico readonly: systemId   
		@datatype: String
	*/
	this.systemId = new String(psystemId);

	/**
		Atributo publico readonly: notationName   
		@datatype: String
	*/
	this.notationName = new String(pnotationName);
}



//---------------------------------------------------------------------------------
//	Interface: EntityReference   extend Node 
//---------------------------------------------------------------------------------
function EntityReference (entityname) // extend Node 
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.ENTITY_REFERENCE_NODE; // defino el tipo de nodo
	this.nodeName = new String(entityname);
}



//---------------------------------------------------------------------------------
//	Interface: EntityReference   extend Node 
//---------------------------------------------------------------------------------
function ProcessingInstruction (pdata,ptarget) // extend Node 
{
	Node.call(this); // constructor de la superclase
	this.nodeType = sWebGl.PROCESSING_INSTRUCTION_NODE; // defino el tipo de nodo
	this.nodeName = new String(pdata);
	this.nodeValue = new String(ptarget);

	/**
		Atributo publico readonly: data    
		@datatype: String
	*/
	this.data  = new String(pdata);

	/**
		Atributo publico readonly: target     
		@datatype: String
	*/
	this.target = new String(ptarget);
}
