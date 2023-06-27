var allMales = {
    
    "all":[
        {'id':0, 'name': 'Teku WAKAM Jean Marie'},
        {'id':1, 'name': 'TADJUIDJE KAMDEM Fidele'},
    ],
    "alive": [
        {'id':1, 'name': 'TADJUIDJE KAMDEM Fidele'},
    ],
    "dead": [
        {'id':0, 'name': 'Teku WAKAM Jean Marie'},
    ],
    "youngdead": [
    ]
};
var allFemales = {
    "all":[
        {'id':0, 'name': 'Guemthueng Marie'},
        {'id':1, 'name': 'KENMEUGNE Chantal'},
        {'id':2, 'name': 'YOUEGO'},
    ],
    "alive": [
        {'id':0, 'name': 'Guemthueng Marie'},
        {'id':1, 'name': 'KENMEUGNE Chantal'},
    ],
    "dead": [
        {'id':2, 'name': 'YOUEGO'},
    ],
    "youngdead": [
    ]
};

var allConjoints = [];
var nbConjoints = 0;
var allEnfants = [];
var nbEnfants = 0;

var myGenderValue;
var myLifeStatusValue;
var motherLifeStatusValue;
var fatherLifeStatusValue;
var noPhotoCheck = false;

var currentMemberId = null;
var currentMember = null;
var urlLastItem = null;
var urlLastButOneItem = null;
var isIncomingSpouse = false;  

(function ($) {
    $(document).ready(function ($) {

        function getFamilyMemebers() {
            let  currentPath = window.location.pathname;
            let currentPathArray = currentPath.split("/");
            urlLastButOneItem = currentPathArray[currentPathArray.length-2];
            urlLastItem = currentPathArray[currentPathArray.length-1];
            if (urlLastButOneItem == 'update_item' && !isNaN(urlLastItem))
            {
                currentMemberId = currentPathArray[currentPathArray.length-1];
                document.getElementById('form_title').innerHTML = "Modifier un membre de famille"
                document.getElementById('create_fm_btn').innerHTML = "Valider les modifications"
                
            }
            else if (urlLastButOneItem == 'new_child' && !isNaN(urlLastItem)) 
            {
                currentMemberId = urlLastItem;
            }
            else if (urlLastButOneItem == 'new_spouse' && !isNaN(urlLastItem)) 
            {
                currentMemberId = urlLastItem;
                isIncomingSpouse = true;
            }


            $.ajax({
                type: 'GET',
                url: "/family_form_data",
                data: {"currentMemberId": currentMemberId == null ? 'none': currentMemberId},
                success: function (response) {
                    // console.log(response) 
                    allMales = response["allMales"];
                    allFemales = response["allFemales"];
                    currentMember = response['currentMember'];

                    if (currentMemberId !== null && urlLastButOneItem == 'new_child') {
                        if (currentMember["myGender"] == 'f') {
                            /**
                             * MOTHER
                             */
                            let motherSelect = document.getElementById(`parent_female_select`);
                            motherSelect.innerHTML = "";
                            let motherGenderArray = document.getElementsByName(`radio_sexe_mother`);
                            let motherLifeStatusArray = document.getElementsByName(`radio_status_mother`);
                            // //////////////////////////////
                            document.getElementById('noParentCheck').checked = false;
                            document.getElementById('checkbox-mother').checked = true;                            
                            for(let i = 0; i < motherLifeStatusArray.length; i++) {
                                if(motherLifeStatusArray[i].value == currentMember["mother"]["status"]){
                                    motherLifeStatusArray[i].checked = true
                                }
                                updateStatusGenderSelectList(motherSelect, motherLifeStatusArray[i], allMales, allFemales, motherGenderArray)
                            }                            
                            // *********************************************
                            let opts = document.getElementById('parent_female_select').children;
                            for(let i = 0; i < opts.length; i++) {
                                // console.log(opts[i].value);
                                if(opts[i].value == currentMemberId){
                                    // console.log(opts[i]);
                                    opts[i].setAttribute("selected", true);
                                }
                            }


                        } else if (currentMember["myGender"] == 'm'){
                            /**
                             * FATHER
                             */
                            let fatherSelect = document.getElementById(`parent_male_select`);
                            fatherSelect.innerHTML = "";
                            let fatherGenderArray = document.getElementsByName(`radio_sexe_father`);
                            let fatherLifeStatusArray = document.getElementsByName(`radio_status_father`);
                            // //////////////////////////////
                            document.getElementById('noParentCheck').checked = false;
                            document.getElementById('checkbox-father').checked = true;                            
                            for(let i = 0; i < fatherLifeStatusArray.length; i++) {
                                if(fatherLifeStatusArray[i].value == currentMember["father"]["status"]){
                                    fatherLifeStatusArray[i].checked = true
                                }
                                updateStatusGenderSelectList(fatherSelect, fatherLifeStatusArray[i], allMales, allFemales, fatherGenderArray)
                            }                            
                            // *********************************************
                            let opts = document.getElementById('parent_male_select').children;
                            for(let i = 0; i < opts.length; i++) {
                                // console.log(opts[i].value);
                                if(opts[i].value == currentMemberId){
                                    // console.log(opts[i]);
                                    opts[i].setAttribute("selected", true);
                                }
                            }

                        }                        
                        
                    }

                    // ==================================================================
                    else if (currentMemberId !== null && urlLastButOneItem == 'new_spouse') {
                        // parents_form_section
                        document.getElementById('form_title').innerHTML = `Nouveau conjoint pour <br> ${currentMember['myName']}`                        
                        // document.getElementById(`parents_form_section`).classList.add('displayNone');
                        document.getElementById(`parent_male_select`).classList.toggle('displayNone')
                        document.getElementById(`new_parent_male_input`).setAttribute('type', 'text')
                        document.getElementById(`parent_female_select`).classList.toggle('displayNone')
                        document.getElementById(`new_parent_female_input`).setAttribute('type', 'text')
                        
                        document.getElementById('ajoutConjointBtn').classList.add('displayNone');                        
                        addSpouse();
                        document.getElementById(`mini_close_conjoint_${nbConjoints}`).classList.add('displayNone');
                        // document.getElementById(`new_conjoint_span_${nbConjoints}`).classList.add('displayNone');
                        // *********************************************
                        let conjointSelect = document.getElementById(`conjoint_select_${nbConjoints}`);
                        conjointSelect.innerHTML = "";
                        let conjointGenderArray = document.getElementsByName(`radio-sexe-conjoint-${nbConjoints}`);
                        for(let i = 0; i < conjointGenderArray.length; i++) {
                            if(conjointGenderArray[i].value == currentMember["myGender"]){
                                conjointGenderArray[i].checked = true;
                            }                            
                        }
                        // *********************************************
                        let conjointLifeStatusArray = document.getElementsByName(`radio-statut-conjoint-${nbConjoints}`);                            
                        for(let i = 0; i < conjointLifeStatusArray.length; i++) {
                            if(conjointLifeStatusArray[i].value == currentMember["myLifeStatus"]){
                                conjointLifeStatusArray[i].checked = true;
                            }
                            updateStatusGenderSelectList(conjointSelect, conjointLifeStatusArray[i], allMales, allFemales, conjointGenderArray)
                        }
                        // *********************************************
                        let opts = document.getElementById(`conjoint_select_${nbConjoints}`).children;
                        for(let i = 0; i < opts.length; i++) {
                            if(opts[i].value == currentMemberId){
                                opts[i].setAttribute("selected", true);
                            }
                        }
                        // *********************************************
                        
                    }

                    // ===================================================================
                    else if (currentMemberId !== null && urlLastButOneItem == 'update_item') {
                        /**
                         * MOI
                         */
                        if (currentMember["isIncomingSpouse"]) {
                            isIncomingSpouse = true;
                        }
                        document.getElementById('my_name').value = currentMember["myName"];    

                        let myGenderArray = document.getElementsByName('radio_gender_moi');    
                        for(let i = 0; i < myGenderArray.length; i++) {
                            if(myGenderArray[i].value == currentMember["myGender"]){
                                myGenderArray[i].checked = true
                            }                            
                        }
                        let myLifeStatusArray = document.getElementsByName('radio_status_moi');    
                        for(let i = 0; i < myLifeStatusArray.length; i++) {
                            if(myLifeStatusArray[i].value == currentMember["myLifeStatus"]){
                                myLifeStatusArray[i].checked = true
                            }
                        }
                        const dropZoneElement = document.getElementById("dropzone");
                        
                        if (currentMember["myPhoto"] != null) {
                            // const inputElement = document.getElementById("real-file");
                            // inputElement.files = currentMember["myPhoto"];

                            let thumbnailElement = document.createElement("div");
                            thumbnailElement.classList.add("droparea__thumb");
                            thumbnailElement.dataset.label = "Modifier";
                            
                            thumbnailElement.style.backgroundImage = `url('${currentMember["myPhoto"]}')`;
                            dropZoneElement.appendChild(thumbnailElement);
                          }
                        /**
                         * MOTHER
                         */
                        let motherSelect = document.getElementById(`parent_female_select`);
                        motherSelect.innerHTML = "";
                        let motherGenderArray = document.getElementsByName(`radio_sexe_mother`);
                        let motherLifeStatusArray = document.getElementsByName(`radio_status_mother`);
                        if (currentMember["mother"]["id"]) {
                            document.getElementById('noParentCheck').checked = false;
                            document.getElementById('checkbox-mother').checked = true;                            
                            for(let i = 0; i < motherLifeStatusArray.length; i++) {
                                if(motherLifeStatusArray[i].value == currentMember["mother"]["status"]){
                                    motherLifeStatusArray[i].checked = true
                                }
                                updateStatusGenderSelectList(motherSelect, motherLifeStatusArray[i], allMales, allFemales, motherGenderArray)
                            }                            
                            // *********************************************
                            let opts = document.getElementById('parent_female_select').children;
                            for(let i = 0; i < opts.length; i++) {
                                // console.log(opts[i].value);
                                if(opts[i].value == currentMember["mother"]["id"]){
                                    // console.log(opts[i]);
                                    opts[i].setAttribute("selected", true);
                                }
                            }                            
                        }
                        // Spouse Mother ///////////////////////////////
                        else if (currentMember["isIncomingSpouse"] && currentMember["sMotherName"]) {
                            document.getElementById(`parent_female_select`).classList.toggle('displayNone');
                            document.getElementById(`new_parent_female_input`).setAttribute('type', 'text');
                            document.getElementById('noParentCheck').checked = false;
                            document.getElementById('checkbox-mother').checked = true;                            
                            document.getElementById(`new_parent_female_input`).value = currentMember["sMotherName"];
                            for(let i = 0; i < motherLifeStatusArray.length; i++) {
                                if(motherLifeStatusArray[i].value == currentMember["sMotherStatus"]){
                                    motherLifeStatusArray[i].checked = true
                                }
                                updateStatusGenderSelectList(motherSelect, motherLifeStatusArray[i], allMales, allFemales, motherGenderArray)
                            }
                        }
                        else {
                            for(let i = 0; i < motherLifeStatusArray.length; i++) {
                                updateStatusGenderSelectList(motherSelect, motherLifeStatusArray[i], allMales, allFemales, motherGenderArray)
                            } 
                        }
                        /**
                         * FATHER
                         */
                        let fatherSelect = document.getElementById(`parent_male_select`);
                        fatherSelect.innerHTML = "";
                        let fatherGenderArray = document.getElementsByName(`radio_sexe_father`);
                        let fatherLifeStatusArray = document.getElementsByName(`radio_status_father`);
                        if (currentMember["father"]["id"] && !currentMember["isIncomingSpouse"]) {
                            document.getElementById('noParentCheck').checked = false;
                            document.getElementById('checkbox-father').checked = true;                            
                            for(let i = 0; i < fatherLifeStatusArray.length; i++) {
                                if(fatherLifeStatusArray[i].value == currentMember["father"]["status"]){
                                    fatherLifeStatusArray[i].checked = true
                                }
                                updateStatusGenderSelectList(fatherSelect, fatherLifeStatusArray[i], allMales, allFemales, fatherGenderArray)
                            }                            
                            // *********************************************
                            let opts = document.getElementById('parent_male_select').children;
                            for(let i = 0; i < opts.length; i++) {
                                // console.log(opts[i].value);
                                if(opts[i].value == currentMember["father"]["id"]){
                                    // console.log(opts[i]);
                                    opts[i].setAttribute("selected", true);
                                }
                            }                            
                        }
                        // Spouse Father ///////////////////////////////
                        else if (currentMember["isIncomingSpouse"] && currentMember["sFatherName"]) {
                            document.getElementById(`parent_male_select`).classList.toggle('displayNone');
                            document.getElementById(`new_parent_male_input`).setAttribute('type', 'text');
                            document.getElementById('noParentCheck').checked = false;
                            document.getElementById('checkbox-father').checked = true;                            
                            document.getElementById(`new_parent_male_input`).value = currentMember["sFatherName"];
                            for(let i = 0; i < fatherLifeStatusArray.length; i++) {
                                if(fatherLifeStatusArray[i].value == currentMember["sFatherStatus"]){
                                    fatherLifeStatusArray[i].checked = true
                                }
                                updateStatusGenderSelectList(fatherSelect, fatherLifeStatusArray[i], allMales, allFemales, fatherGenderArray)
                            }
                        }
                        else {
                            for(let i = 0; i < fatherLifeStatusArray.length; i++) {
                                updateStatusGenderSelectList(fatherSelect, fatherLifeStatusArray[i], allMales, allFemales, fatherGenderArray)
                            }  
                        }
                        // *******************************************************
                        // *******************************************************
                        
                        // *******************************************************
                        /**
                         * CONJOINTS
                         */
                        if (currentMember["spouses"].length > 0) {
                            for(let r = 0; r < currentMember["spouses"].length; r++) {
                                addSpouse();
                                let conjointSelect = document.getElementById(`conjoint_select_${nbConjoints}`);
                                conjointSelect.innerHTML = "";
                                let conjointGenderArray = document.getElementsByName(`radio-sexe-conjoint-${nbConjoints}`);    
                                // console.log(conjointGenderArray);
                                for(let i = 0; i < conjointGenderArray.length; i++) {
                                    if(conjointGenderArray[i].value == currentMember["spouses"][r]["gender"]){
                                        conjointGenderArray[i].checked = true;
                                    }                            
                                }
                                let conjointLifeStatusArray = document.getElementsByName(`radio-statut-conjoint-${nbConjoints}`);    
                                // console.log(conjointLifeStatusArray);
                                for(let i = 0; i < conjointLifeStatusArray.length; i++) {
                                    if(conjointLifeStatusArray[i].value == currentMember["spouses"][r]["status"]){
                                        conjointLifeStatusArray[i].checked = true;
                                    }
                                    updateStatusGenderSelectList(conjointSelect, conjointLifeStatusArray[i], allMales, allFemales, conjointGenderArray)
                                }
                                // *********************************************

                                // *********************************************
                                let opts = document.getElementById(`conjoint_select_${nbConjoints}`).children;
                                for(let i = 0; i < opts.length; i++) {
                                    if(opts[i].value == currentMember["spouses"][r]["id"]){
                                        opts[i].setAttribute("selected", true);
                                    }
                                }
                            }                            
                        }
                        /**
                         * MES INFORMATIONS
                         */
                        document.getElementById('birthdate').value = currentMember["birthdate"];
                        document.getElementById('birthplace').value = currentMember["birthplace"];
                        document.getElementById('birthrank').value = currentMember["birthrank"];
                        document.getElementById('email').value = currentMember["email"];
                        document.getElementById('telephone').value = currentMember["telephone"];
                        document.getElementById('profession').value = currentMember["profession"];
                        document.getElementById('country').value = currentMember["country"];
                        document.getElementById('city').value = currentMember["city"];
                        document.getElementById('linkedin').value = currentMember["linkedin"];
                        document.getElementById('twitter').value = currentMember["twitter"];
                        document.getElementById('facebook').value = currentMember["facebook"];
                        document.getElementById('instagram').value = currentMember["instagram"];
                        document.getElementById('aboutme').value = currentMember["aboutme"];
                    }                    
                },
                error: function (response) {
                    console.log(response)
                    // alert(response)
                }
            })
        }
        getFamilyMemebers();
        // setTimeout(() => {
        //     getFamilyMemebers()
        // }, 200);


        // /////////////////////////////////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////////////////////////////////
        var noPhoto = document.getElementById('noPhotoCheck');
        var dropareaId = document.getElementById('dropareaId');
        var noParents = document.getElementById('noParentCheck');
        var hasMother = document.getElementById('checkbox-mother');
        var hasFather = document.getElementById('checkbox-father');

        hasMother.addEventListener('change', ()=> {
            if (hasMother.checked) {
                noParents.checked = false;
            }
        });
        hasFather.addEventListener('change', ()=> {
            if (hasFather.checked) {
                noParents.checked = false;
            }
        });
        noParents.addEventListener('change', ()=> {
            if (noParents.checked) {
                hasFather.checked = false;
                hasMother.checked = false;
            }
        });
        noPhoto.addEventListener('change', ()=> {
            noPhotoCheck = noPhoto.checked;
            dropareaId.classList.toggle('displayNone');
        });
        
        // ********************
        let motherSelect = document.getElementById(`parent_female_select`)
        motherSelect.innerHTML = "";
        let motherGenderArray = document.getElementsByName(`radio_sexe_mother`); 
        
        let motherStatusArray = document.getElementsByName(`radio_status_mother`);    
        for(let j = 0; j < motherStatusArray.length; j++) { 
            if (!currentMemberId) {
                setTimeout(() => {
                    updateStatusGenderSelectList(motherSelect, motherStatusArray[j], allMales, allFemales, motherGenderArray)
                }, 200);
            }
            
            
            motherStatusArray[j].addEventListener("change", function(e){
                motherSelect.innerHTML = "";
                updateStatusGenderSelectList(motherSelect, motherStatusArray[j], allMales, allFemales, motherGenderArray)                                    
            })                
        }
        // ********************
        let fatherSelect = document.getElementById(`parent_male_select`)
        fatherSelect.innerHTML = "";
        let fatherGenderArray = document.getElementsByName(`radio_sexe_father`); 
        
        let fatherStatusArray = document.getElementsByName(`radio_status_father`);    
        for(let j = 0; j < fatherStatusArray.length; j++) {
            if (!currentMemberId) {
                setTimeout(() => {
                    updateStatusGenderSelectList(fatherSelect, fatherStatusArray[j], allMales, allFemales, fatherGenderArray)
                }, 200); 
            }
            
            fatherStatusArray[j].addEventListener("change", function(e){
                fatherSelect.innerHTML = "";
                updateStatusGenderSelectList(fatherSelect, fatherStatusArray[j], allMales, allFemales, fatherGenderArray)                                    
            })                
        }  

        // ////////////////////////////////////////////////////////////////////
        var addSpouseBtn = document.getElementById('ajoutConjointBtn');
        // var addEnfantBtn = document.getElementById('ajoutEnfantBtn');

        addSpouseBtn.addEventListener('click', ()=> {
            addSpouse();
        })

        
        

    


        // addEnfantBtn.addEventListener('click', ()=> {
        //     nbEnfants++
        //     let oneChild = document.createElement('div');
        //     oneChild.setAttribute('class', 'composed-checkbox-container')
        //     oneChild.setAttribute('id', `enfant_container_${nbEnfants}`)
        //     oneChild.innerHTML = `
        //     <span class="mini_close" id="mini_close_enfant_${nbEnfants}" onclick="handleCloseElm('enfant',${nbEnfants})"></span>
        //     <div>
        //         <div class="mini_header">
        //             <span for="checkbox-mother" class="sub_title">Enfant</span>
                    
        //         </div>
        //         <div class="form_radio_container">
        //             <div class="radio_group_title">Sexe : </div>
        //             <label class="radio_item_container">                        
        //                 <input type="radio" value="m" checked="checked" name="radio-sexe-enfant-${nbEnfants}">
        //                 <span class="checkmark"></span>
        //                 <span>Homme</span>
        //             </label>
        //             <label class="radio_item_container">                        
        //                 <input type="radio" value="f" name="radio-sexe-enfant-${nbEnfants}">
        //                 <span class="checkmark"></span>
        //                 <span>Femme</span>
        //             </label>
        //         </div>
        //         <div class="form_radio_container">
        //             <div class="radio_group_title">Statut : </div>
        //             <label class="radio_item_container">                        
        //                 <input type="radio" value="vie" checked="checked" name="radio-statut-enfant-${nbEnfants}">
        //                 <span class="checkmark"></span>
        //                 <span>En vie</span>
        //             </label>
        //             <label class="radio_item_container">                        
        //                 <input type="radio" value="mort" name="radio-statut-enfant-${nbEnfants}">
        //                 <span class="checkmark"></span>
        //                 <span>Mort(e)</span>
        //             </label>
        //             <label class="radio_item_container">                        
        //                 <input type="radio" value="mba" name="radio-statut-enfant-${nbEnfants}">
        //                 <span class="checkmark"></span>
        //                 <span>Mort(e) à bas âge</span>
        //             </label>
        //         </div>
        //         <i class="indication-note"><small>(Sélectionnez son nom dans la liste déroulante OU cliquez sur "Ajouter un nom" si son nom n'est pas dans la liste)</small></i>                        
        //         <div class="form_input_container">
        //             <select id="enfant_select_${nbEnfants}">
        //                 <option value="0">Guemthueng Marie</option>
        //                 <option value="1">KENMEUGNE Chantal</option>                                
        //             </select>
        //             <input type="hidden" name="new_enfant_input_${nbEnfants}" id="new_enfant_input_${nbEnfants}" placeholder="Nom de l'enfant ...">                            
        //             <label class="new_income_category" for="new_enfant_check_${nbEnfants}">
        //                 <input type="checkbox" name="" id="new_enfant_check_${nbEnfants}" onchange="handleNewCheck(this, 'enfant', ${nbEnfants})">
        //                 <span id="new_enfant_span_${nbEnfants}">+ Ajouter un nom</span>            
        //             </label>
        //         </div>
        //         <div class="form_input_container">
        //             <input type="number" name="enfant_rank_${nbEnfants}" id="enfant_rank_${nbEnfants}" placeholder="Rang de naissance ...">                            
        //         </div>            
        //     </div>
        //     `
        //     document.getElementById('all_enfants').appendChild(oneChild)

        //     let enfantSelect = document.getElementById(`enfant_select_${nbEnfants}`)
        //     enfantSelect.innerHTML = "";
        //     let enfantGenderArray = document.getElementsByName(`radio-sexe-enfant-${nbEnfants}`);    
        //     let enfantStatusArray = document.getElementsByName(`radio-statut-enfant-${nbEnfants}`);    
        //     for(let j = 0; j < enfantGenderArray.length; j++) {
        //         updateGenderStatusSelectList(enfantSelect, enfantGenderArray[j], allMales, allFemales, enfantStatusArray)
                
        //         enfantGenderArray[j].addEventListener("change", function(e){
        //             enfantSelect.innerHTML = "";
        //             updateGenderStatusSelectList(enfantSelect, enfantGenderArray[j], allMales, allFemales, enfantStatusArray)                                    
        //         })
        //         enfantStatusArray[j].addEventListener("change", function(e){
        //             enfantSelect.innerHTML = "";
        //             updateStatusGenderSelectList(enfantSelect, enfantStatusArray[j], allMales, allFemales, enfantGenderArray)                                    
        //         })                
        //     }            
            
        //     let oneEnfant= {
        //         "index": nbEnfants,
        //         "gender": null,
        //         "status": null,
        //         "enfantId":null,
        //         "enfantRank":null,
        //         "newEnfantCheck":false,
        //         "newEnfantName": null
        //     };
        //     allEnfants.push(oneEnfant);
        // })














        
                
        function handleNewParentCheck(elm, parentype, parentname) {
            // newParentCheck[parentname] = elm.checked
            if (elm.checked) {                
                document.getElementById(`${parentype}_select`).classList.toggle('displayNone')
                document.getElementById(`new_${parentype}_input`).setAttribute('type', 'text')
                document.getElementById(`new_${parentype}_span`).innerText = `Sélectionner un nom`
                
            } else {
                document.getElementById(`${parentype}_select`).classList.toggle('displayNone')
                document.getElementById(`new_${parentype}_input`).setAttribute('type', 'hidden')
                document.getElementById(`new_${parentype}_span`).innerText = `+ Ajouter un nom`
                
            }
        }
        $('#new_parent_male_check').change(() => {
            handleNewParentCheck($('#new_parent_male_check')[0], 'parent_male', 'father')
        })
        $('#new_parent_female_check').change(()=>{
            handleNewParentCheck($('#new_parent_female_check')[0], 'parent_female', 'mother')
        })


        function handleNoParentCheck(elm, parentype, parentname) {
            // noParentCheck[parentname] = elm.checked
            // console.log(`${parentype} - handled`)
            if (elm.checked) {                
                document.getElementById(`${parentype}_select`).classList.add('displayNone')
                document.getElementById(`new_${parentype}_input`).classList.add('displayNone')
                document.getElementById(`new_${parentype}_span`).classList.add('displayNone')
            } else {
                document.getElementById(`${parentype}_select`).classList.toggle('displayNone')
                document.getElementById(`new_${parentype}_input`).classList.toggle('displayNone')
                document.getElementById(`new_${parentype}_span`).classList.toggle('displayNone')
            }
        }
        $('#no_parent_male_check').change(() => {
            handleNoParentCheck(this, 'parent_male', 'father')
        })
        $('#no_parent_female_check').change(()=>{
            handleNoParentCheck(this, 'parent_female', 'mother')
        })

        
        // ////////////////////////////////////////////////////////////////////////////////

        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    
        function sendFamilyMemberRequest(e) {
            e.preventDefault();
            /**
             * MOI
             */            
            let myName = document.getElementById('my_name').value;  
                    
            let uploaded_img = null;
            let myGenderArray = document.getElementsByName('radio_gender_moi');    
            for(let i = 0; i < myGenderArray.length; i++) {
                if(myGenderArray[i].checked)
                myGenderValue = myGenderArray[i].value
            }
            let myLifeStatusArray = document.getElementsByName('radio_status_moi');    
            for(let i = 0; i < myLifeStatusArray.length; i++) {
                if(myLifeStatusArray[i].checked)
                myLifeStatusValue = myLifeStatusArray[i].value
            }
            var fileInput = document.getElementById("real-file");
            // alert(fileInput.files.length)
            if(fileInput.files.length !== 0 ) {
                uploaded_img = $('#real-file').get(0).files[0];
                // alert(uploaded_img.name);
                // debugger
                // let form_data = new FormData();
                // form_data.append("uploadedImg", uploaded_img);
            }
            // debugger
            /**
             * MOTHER
             */
            let motherId = document.getElementById('parent_female_select').value;
            let newMotherCheck = document.getElementById('new_parent_female_check')?.checked;         
            let newMotherName = document.getElementById('new_parent_female_input').value;
            let hasMotherCheck = document.getElementById('checkbox-mother').checked;
            let motherLifeStatusArray = document.getElementsByName('radio_status_mother');    
            for(let i = 0; i < motherLifeStatusArray.length; i++) {
                if(motherLifeStatusArray[i].checked)
                motherLifeStatusValue = motherLifeStatusArray[i].value;
            }
            /**
             * FATHER
             */
            let fatherId = document.getElementById('parent_male_select').value;
            let newFatherCheck = document.getElementById('new_parent_male_check')?.checked;         
            let newFatherName = document.getElementById('new_parent_male_input').value;
            let hasFatherCheck = document.getElementById('checkbox-father').checked;
            let fatherLifeStatusArray = document.getElementsByName('radio_status_father');    
            for(let i = 0; i < fatherLifeStatusArray.length; i++) {
                if(fatherLifeStatusArray[i].checked)
                fatherLifeStatusValue = fatherLifeStatusArray[i].value;
            }
            /**
             * CONJOINTS
             */
            for(let i = 0; i < allConjoints.length; i++) {
                let cindex = allConjoints[i]["index"];

                let conjointGenderArray = document.getElementsByName(`radio-sexe-conjoint-${cindex}`);    
                for(let j = 0; j < conjointGenderArray.length; j++) {
                    if(conjointGenderArray[j].checked)
                    allConjoints[i]["gender"] = conjointGenderArray[j].value
                }
                let conjointLifeStatusArray = document.getElementsByName(`radio-statut-conjoint-${cindex}`);    
                for(let j = 0; j < conjointLifeStatusArray.length; j++) {
                    if(conjointLifeStatusArray[j].checked)
                    allConjoints[i]["status"] = conjointLifeStatusArray[j].value
                }
                allConjoints[i]["conjointId"] = document.getElementById(`conjoint_select_${cindex}`).value;
                // allConjoints[i]["conjointRank"] = document.getElementById(`conjoint_rank_${cindex}`).value;
                // allConjoints[i]["newConjointCheck"] = document.getElementById(`new_conjoint_check_${cindex}`)?.checked;         
                allConjoints[i]["newConjointCheck"] = false;
                allConjoints[i]["newConjointName"] = document.getElementById(`new_conjoint_input_${cindex}`).value;                
            }
            // console.log(allConjoints[0]);
            // debugger
            /**
             * ENFANTS
             */
            // for(let i = 0; i < allEnfants.length; i++) {
            //     let cindex = allEnfants[i]["index"];

            //     let enfantGenderArray = document.getElementsByName(`radio-sexe-enfant-${cindex}`);    
            //     for(let j = 0; j < enfantGenderArray.length; j++) {
            //         if(enfantGenderArray[j].checked)
            //         allEnfants[i]["gender"] = enfantGenderArray[j].value
            //     }
            //     let enfantLifeStatusArray = document.getElementsByName(`radio-statut-enfant-${cindex}`);    
            //     for(let j = 0; j < enfantLifeStatusArray.length; j++) {
            //         if(enfantLifeStatusArray[j].checked)
            //         allEnfants[i]["status"] = enfantLifeStatusArray[j].value
            //     }
            //     allEnfants[i]["enfantId"] = document.getElementById(`enfant_select_${cindex}`).value;
            //     allEnfants[i]["enfantRank"] = document.getElementById(`enfant_rank_${cindex}`).value;
            //     allEnfants[i]["newEnfantCheck"] = document.getElementById(`new_enfant_check_${cindex}`).checked;         
            //     allEnfants[i]["newEnfantName"] = document.getElementById(`new_enfant_input_${cindex}`).value;                
            // }
            /**
             * AUTRES INFORMATIONS
             */
            let birthdate = document.getElementById('birthdate').value;
            let birthplace = document.getElementById('birthplace').value;  
            let birthrank = document.getElementById('birthrank').value;  
            let email = document.getElementById('email').value;  
            let telephone = document.getElementById('telephone').value;  
            let profession = document.getElementById('profession').value;  
            let country = document.getElementById('country').value;  
            let city = document.getElementById('city').value;  
            let linkedin = document.getElementById('linkedin').value;  
            let twitter = document.getElementById('twitter').value;
            let facebook = document.getElementById('facebook').value;
            let instagram = document.getElementById('instagram').value;
            let aboutme = document.getElementById('aboutme').value;
            
            // console.log(aboutme);
            // debugger

            // let generationLevel = document.getElementById('generation_level_input').value;            
            // let birthRank = document.getElementById('birth_rank_input').value;

            // let spouse_values = [];
            // let spouses = document.getElementsByName('spouse');   
            // for(i = 0; i < spouses.length; i++) {
            //     if(spouses[i].checked)
            //     spouse_values.push(spouses[i].value)
            // }
            

            let form_data = new FormData();
            form_data.append("currentMemberId", currentMemberId);
            form_data.append("urlLastButOneItem", urlLastButOneItem);
            form_data.append("myName", myName);
            form_data.append("myGender", myGenderValue);
            form_data.append("myLifeStatus", myLifeStatusValue);
            form_data.append("isIncomingSpouse", isIncomingSpouse);
            form_data.append("noPhotoCheck", noPhotoCheck);
            form_data.append("uploadedPhoto", uploaded_img);
            form_data.append("uploadedPhotoName", uploaded_img?.name);


            form_data.append("fatherId", parseInt(fatherId));
            form_data.append("newFatherCheck", newFatherCheck);
            form_data.append("newFatherName", newFatherName);
            form_data.append("hasFatherCheck", hasFatherCheck);
            form_data.append("fatherLifeStatusValue", fatherLifeStatusValue);

            form_data.append("motherId", parseInt(motherId));
            form_data.append("newMotherCheck", newMotherCheck);
            form_data.append("newMotherName", newMotherName);            
            form_data.append("hasMotherCheck", hasMotherCheck);
            form_data.append("motherLifeStatusValue", motherLifeStatusValue);

            form_data.append("spouseValues", JSON.stringify(allConjoints));
            // form_data.append("childValues", allConjoints);

            form_data.append("birthdate", birthdate);
            form_data.append("birthplace", birthplace);
            form_data.append("birthrank", birthrank);
            form_data.append("email", email);
            form_data.append("telephone", telephone);
            form_data.append("profession", profession);
            form_data.append("country", country);
            form_data.append("city", city);
            form_data.append("linkedin", linkedin);
            form_data.append("twitter", twitter);
            form_data.append("facebook", facebook);
            form_data.append("instagram", instagram);
            form_data.append("aboutme", aboutme);

            
   
            $.ajaxSetup({
                headers:{
                'X-CSRFToken': getCookie("csrftoken")
                },
                beforeSend: function() {
                    // $('#sgenerator_download_save_buttons').hide();
                    // $('#loader_hw').removeClass("displayNone");
                },
                complete: function(){
                    // $('#sgenerator_download_save_buttons').show();
                    // $('#loader_hw').addClass("displayNone");
                 },
            });
            jQuery.ajax({  //+"new_income/"
                url: '/new_fm',
                type: "POST",
                data: form_data,
                contentType: false,
                processData: false,
                success: function (response) {
                    // console.log("Well done !!");

                    var reloadLink = document.createElement('a');
                    reloadLink.href = '/family_list';
                    document.body.appendChild(reloadLink);
                    reloadLink.click();
                    reloadLink.remove();
                },
                error: function (response) {
                    alert("Something went wrong");
                }
            });
        }

        document.getElementById('create_fm_btn').addEventListener("click", function(e){
            sendFamilyMemberRequest(e)
        })

        
    })

}($));


function handleNewCheck(elm, name, index) {
    // newParentCheck[parentname] = elm.checked
    // console.log(`${name} - handled`)
    if (elm.checked) {                
        document.getElementById(`${name}_select_${index}`).classList.toggle('displayNone')
        document.getElementById(`new_${name}_input_${index}`).setAttribute('type', 'text')
        document.getElementById(`new_${name}_span_${index}`).innerText = `Sélectionner un nom`
        // console.log(`${name} - handled`)
    } else {
        document.getElementById(`${name}_select_${index}`).classList.toggle('displayNone')
        document.getElementById(`new_${name}_input_${index}`).setAttribute('type', 'hidden')
        document.getElementById(`new_${name}_span_${index}`).innerText = `+ Ajouter un nom`
        // console.log(`${name} - handled-2`)
    }
}

function handleCloseElm(name, index) {
    // console.log(`${name}_container_${index}`)
    let oneElm = document.getElementById(`${name}_container_${index}`)
    document.getElementById(`all_${name}s`).removeChild(oneElm)
    // nbConjoints--

    if (name == 'conjoint') {
        for (let i = 0; i < allConjoints.length; i++) {
            if (allConjoints[i]["index"] == index) {
                allConjoints.splice(i, 1); 
            }
            
        }
    } else if(name == 'enfant')  {
        for (let i = 0; i < allEnfants.length; i++) {
            if (allEnfants[i]["index"] == index) {
                allEnfants.splice(i, 1); 
            }
            
        }
    }
}

function updateGenderSelectList(selectList, maleArray, femaleArray, memberArrayName, statusRadioItem) {
    // console.log("////////////////")
    if(statusRadioItem.checked) {
        if(statusRadioItem.value == 'm') {
            // console.log("statusRadioItem.value == m");
            for(let r = 0; r < maleArray[memberArrayName].length; r++) {
                let oneElm = document.createElement('option');
                oneElm.setAttribute('value', maleArray[memberArrayName][r]['id'])
                oneElm.innerHTML = maleArray[memberArrayName][r]['name']
                selectList.appendChild(oneElm)
            }
        }
        else if(statusRadioItem.value == 'f') {
            // console.log("statusRadioItem.value == f");
            
            for(let r = 0; r < femaleArray[memberArrayName].length; r++) {
                let oneElm = document.createElement('option');
                oneElm.setAttribute('value', femaleArray[memberArrayName][r]['id'])
                oneElm.innerHTML = femaleArray[memberArrayName][r]['name']
                selectList.appendChild(oneElm)
                // console.log("==========================")
            }
        }
    }
}

function updateStatusSelectList(selectList, memberArray, statusRadioItem) {
    // console.log("////////////////")
    // console.log(statusRadioItem)
    if(statusRadioItem.checked) {
        if(statusRadioItem.value == 'vie') {
            // console.log("statusRadioItem.value == vie");
            // console.log(memberArray['alive']);
            for(let r = 0; r < memberArray['alive'].length; r++) {
                let oneElm = document.createElement('option');
                oneElm.setAttribute('value', memberArray['alive'][r]['id']);
                oneElm.innerHTML = memberArray['alive'][r]['name'];
                // console.log(oneElm);
                
                selectList.appendChild(oneElm);
                
                // console.log(selectList);
                // debugger
            }
        }
        else if(statusRadioItem.value == 'mort') {
            // console.log("statusRadioItem.value == mort");
            for(let r = 0; r < memberArray['dead'].length; r++) {
                let oneElm = document.createElement('option');
                oneElm.setAttribute('value', memberArray['dead'][r]['id'])
                oneElm.innerHTML = memberArray['dead'][r]['name']
                selectList.appendChild(oneElm)
            }
        }
        else if(statusRadioItem.value == 'mba') {
            // console.log("statusRadioItem.value == mba");
            for(let r = 0; r < memberArray['youngdead'].length; r++) {
                let oneElm = document.createElement('option');
                oneElm.setAttribute('value', memberArray['youngdead'][r]['id'])
                oneElm.innerHTML = memberArray['youngdead'][r]['name']
                selectList.appendChild(oneElm)
            }
        }
    }
}

function updateGenderStatusSelectList(selectContainer, radioItem, allMales, allFemales, statusRadioArray) {
    // selectContainer.innerHTML = "";
    if(radioItem.checked) {
        if(radioItem.value == 'm') {
            // ***
            // console.log("radioItem.value == m")
            for(let j = 0; j < statusRadioArray.length; j++) {
                updateStatusSelectList(selectContainer, allMales, statusRadioArray[j])
                // if(statusRadioArray[j].checked) {
                //     if(statusRadioArray[j].value == 'vie') {
                //         for(let r = 0; r < allMales['alive'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allMales['alive'][r]['id'])
                //             oneElm.innerHTML = allMales['alive'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                //     else if(statusRadioArray[j].value == 'mort') {
                //         for(let r = 0; r < allMales['dead'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allMales['dead'][r]['id'])
                //             oneElm.innerHTML = allMales['dead'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                //     else if(statusRadioArray[j].value == 'mba') {
                //         for(let r = 0; r < allMales['youngdead'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allMales['youngdead'][r]['id'])
                //             oneElm.innerHTML = allMales['youngdead'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                // }
            }
            // ***
        }
        else if(radioItem.value == 'f') {
            // ***
            // console.log("radioItem.value == f")
            for(let j = 0; j < statusRadioArray.length; j++) {
                updateStatusSelectList(selectContainer, allFemales, statusRadioArray[j])
                // if(statusRadioArray[j].checked) {
                //     if(statusRadioArray[j].value == 'vie') {
                //         for(let r = 0; r < allFemales['alive'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allFemales['alive'][r]['id'])
                //             oneElm.innerHTML = allFemales['alive'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                //     else if(statusRadioArray[j].value == 'mort') {
                //         for(let r = 0; r < allFemales['dead'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allFemales['dead'][r]['id'])
                //             oneElm.innerHTML = allFemales['dead'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                //     else if(statusRadioArray[j].value == 'mba') {
                //         for(let r = 0; r < allFemales['youngdead'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allFemales['youngdead'][r]['id'])
                //             oneElm.innerHTML = allFemales['youngdead'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                // }
            }
            // ***            
        }
    }
}


function updateStatusGenderSelectList(selectContainer, radioItem, allMales, allFemales, statusRadioArray) {
    // selectContainer.innerHTML = "";
    if(radioItem.checked) {
        if(radioItem.value == 'vie') {
            // ***
            for(let j = 0; j < statusRadioArray.length; j++) {
                updateGenderSelectList(selectContainer, allMales, allFemales, 'alive', statusRadioArray[j])
                // if(statusRadioArray[j].checked) {
                //     if(statusRadioArray[j].value == 'm') {
                //         for(let r = 0; r < allMales['alive'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allMales['alive'][r]['id'])
                //             oneElm.innerHTML = allMales['alive'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                //     else if(statusRadioArray[j].value == 'f') {
                //         for(let r = 0; r < allFemales['alive'].length; r++) {
                //             let oneElm = document.createElement('option');
                //             oneElm.setAttribute('value', allFemales['alive'][r]['id'])
                //             oneElm.innerHTML = allFemales['alive'][r]['name']
                //             enfantSelect.appendChild(oneElm)
                //         }
                //     }
                // }
            }
            // ***
        }
        else if(radioItem.value == 'mort') {
            // ***
            // console.log("radioItem.value == mort");
            for(let j = 0; j < statusRadioArray.length; j++) {
                updateGenderSelectList(selectContainer, allMales, allFemales, 'dead', statusRadioArray[j])                
            }
            // ***            
        }
        else if(radioItem.value == 'mba') {
            // ***
            for(let j = 0; j < statusRadioArray.length; j++) {
                updateGenderSelectList(selectContainer, allMales, allFemales, 'youngdead', statusRadioArray[j])                
            }
            // ***            
        }
    }
}


function addSpouse() {
    nbConjoints++
    let oneSpouse = document.createElement('div');
    oneSpouse.setAttribute('class', 'composed-checkbox-container')
    oneSpouse.setAttribute('id', `conjoint_container_${nbConjoints}`)
    oneSpouse.innerHTML = `
    <span class="mini_close" id="mini_close_conjoint_${nbConjoints}" onclick="handleCloseElm('conjoint',${nbConjoints})"></span>
    <div>
        <div class="mini_header">
            <span for="checkbox-mother" class="sub_title">Conjoint</span>
            
        </div>
        <div class="form_radio_container">
            <div class="radio_group_title">Sexe : </div>
            <label class="radio_item_container">                        
                <input type="radio" value="m" checked="checked" name="radio-sexe-conjoint-${nbConjoints}">
                <span class="checkmark"></span>
                <span>Homme</span>
            </label>
            <label class="radio_item_container">                        
                <input type="radio" value="f" name="radio-sexe-conjoint-${nbConjoints}">
                <span class="checkmark"></span>
                <span>Femme</span>
            </label>
        </div>
        <div class="form_radio_container">
            <div class="radio_group_title">Statut : </div>
            <label class="radio_item_container">                        
                <input type="radio" value="vie" checked="checked" name="radio-statut-conjoint-${nbConjoints}">
                <span class="checkmark"></span>
                <span>En vie</span>
            </label>
            <label class="radio_item_container">                        
                <input type="radio" value="mort" name="radio-statut-conjoint-${nbConjoints}">
                <span class="checkmark"></span>
                <span>Mort(e)</span>
            </label>
        </div>
        <!-- 
        <i class="indication-note"><small>(Sélectionnez son nom dans la liste déroulante OU cliquez sur "Ajouter un nom" si son nom n'est pas dans la liste)</small></i>                        
        -->
        <div class="form_input_container">
            <select id="conjoint_select_${nbConjoints}">
                <option value="0">Guemthueng Marie</option>
                <option value="1">KENMEUGNE Chantal</option>                                
            </select>
            <input type="hidden" name="new_conjoint_input_${nbConjoints}" id="new_conjoint_input_${nbConjoints}" placeholder="Nom du conjoint ...">                            
            <!-- 
            <label class="new_income_category" for="new_conjoint_check_${nbConjoints}">
                <input type="checkbox" name="" id="new_conjoint_check_${nbConjoints}" onchange="handleNewCheck(this, 'conjoint', ${nbConjoints})">
                <span id="new_conjoint_span_${nbConjoints}">+ Ajouter un nom</span>            
            </label>
            -->
        </div>
        <!--
        <div class="form_input_container">
            <input type="number" name="conjoint_rank_${nbConjoints}" id="conjoint_rank_${nbConjoints}" placeholder="Rang du conjoint ...">                            
        </div> 
        -->                
    </div>
    `
    document.getElementById('all_conjoints').appendChild(oneSpouse)
    let conjSelect = document.getElementById(`conjoint_select_${nbConjoints}`)
    conjSelect.innerHTML = "";
    let conjointGenderArray = document.getElementsByName(`radio-sexe-conjoint-${nbConjoints}`);    
    let conjointStatusArray = document.getElementsByName(`radio-statut-conjoint-${nbConjoints}`);    
    for(let j = 0; j < conjointGenderArray.length; j++) {
        updateGenderStatusSelectList(conjSelect, conjointGenderArray[j], allMales, allFemales, conjointStatusArray)
        
        conjointGenderArray[j].addEventListener("change", function(e){
            conjSelect.innerHTML = "";
            updateGenderStatusSelectList(conjSelect, conjointGenderArray[j], allMales, allFemales, conjointStatusArray)                                    
        })
        conjointStatusArray[j].addEventListener("change", function(e){
            conjSelect.innerHTML = "";
            updateStatusGenderSelectList(conjSelect, conjointStatusArray[j], allMales, allFemales, conjointGenderArray)                                    
        })                
    }

    let oneConj= {
        "index": nbConjoints,
        "gender": null,
        "status": null,
        "conjointId":null,
        "conjointRank":null,
        "newConjointCheck":false,
        "newConjointName": null
    };
    allConjoints.push(oneConj);
}