var allClients = [];
var currentCustomer = [null, null];
var allIncomeStreams = [];
var currentIncomeStream = [null, null];
var allBanks = [];
var currentBank = [null, null];
var newParentCheck = {
    "father": false,
    "mother": false
};
var noParentCheck = {
    "father": false,
    "mother": false
};
var newIncomeCategoryName = '';
var gender_value = null;
var pm_bank_id = null;

(function ($) {
    $(document).ready(function ($) {
        // const gs = document.querySelectorAll("#gender_select div label input");
        // // console.log(gs)
        // // const pmsc = document.querySelectorAll("#payment_method_select option");
        
        // gs.forEach(item => {
        //     console.log("gender_value : ", gender_value)
        //     item.addEventListener("click", ()=>{
        //         if (this.checked) {
        //             gender_value = item.value
        //             console.log("gender_value : ", gender_value)
        //         }
        //     })

        // });

        var gs = document.getElementsByName('gender');
              
        for(i = 0; i < gs.length; i++) {
            if(gs[i].checked)
            gender_value = gs[i].value
                console.log("gender_value : ", gender_value)
        }

        // if (parseInt($('#payment_method_select').value) !== pm_bank_id) {
        //     document.getElementById('bank_name_container').classList.add('displayNone')
        //     document.getElementById('bank_name_container').setAttribute('required', true)
        // }

        // $('#payment_method_select').change(function () {
        //     if (parseInt(this.value) == pm_bank_id) {
        //         document.getElementById('bank_name_container').classList.add('displayNone')
        //         document.getElementById('bank_name_container').setAttribute('required', true)
        //     } else {
        //         document.getElementById('bank_name_container').classList.remove('displayNone')
        //         document.getElementById('bank_name_container').setAttribute('required', false)
        //     }
        // })

        
        function handleNewParentCheck(elm, parentype, parentname) {
            newParentCheck[parentname] = elm.checked
            // console.log(`${parentype} - handled`)
            // console.log(elm)
            if (elm.checked) {                
                document.getElementById(`${parentype}_select`).classList.toggle('displayNone')
                document.getElementById(`new_${parentype}_input`).setAttribute('type', 'text')
                document.getElementById(`new_${parentype}_span`).innerText = `Sélectionner un nom`
                // console.log(`${parentype} - handled`)
            } else {
                document.getElementById(`${parentype}_select`).classList.toggle('displayNone')
                document.getElementById(`new_${parentype}_input`).setAttribute('type', 'hidden')
                document.getElementById(`new_${parentype}_span`).innerText = `+ Ajouter un nom`
                // console.log(`${parentype} - handled-2`)
            }
        }
        $('#new_parent_male_check').change(() => {
            handleNewParentCheck($('#new_parent_male_check')[0], 'parent_male', 'father')
        })
        $('#new_parent_female_check').change(()=>{
            handleNewParentCheck($('#new_parent_female_check')[0], 'parent_female', 'mother')
        })


        function handleNoParentCheck(elm, parentype, parentname) {
            noParentCheck[parentname] = elm.checked
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

        // function getCLients() {
        //     $.ajax({
        //         type: 'GET',
        //         url: "inc_data",
        //         data: {},
        //         success: function (response) {
        //             // if not valid user, alert the user
        //             if(!response["customers"]){
        //                 alert("No customers");
        //             }
        //             else {
        //                 allClients = response["customers"]
        //                 allIncomeStreams = response["incomeStreams"]
        //                 allBanks = response["banks"]
        //                 // console.log(allClients)
        //                 // alert("ALL CLIENTS LIST SET !!!");
        //             }
        //         },
        //         error: function (response) {
        //             console.log(response)
        //         }
        //     })
        // }
        // setTimeout(() => {
        //     getCLients()
        // }, 500);

        // $("#customer_name_input").keyup(function (e) {
        //     input = document.getElementById('customer_name_input');
        //     filter = input.value.toUpperCase();
        //     customerOptions = $("#customerOptions")
        //     customerOptions.empty()
        //     for (i = 0; i < allClients.length; i++) {
        //         txtValue = allClients[i][1];
        //         if (filter.length>0 && txtValue.toUpperCase().indexOf(filter) > -1) {
        //             option = `<li onclick="selectCustomer(${i})">${txtValue}</li>`
        //             customerOptions.append(option)
        //         } else {
        //             // 
        //         }
        //     }
        // })
        // $("#income_details_input").keyup(function (e) {
        //     input = document.getElementById('income_details_input');
        //     filter = input.value.toUpperCase();
        //     incomeDetailsOptions = $("#incomeDetailsOptions")
        //     incomeDetailsOptions.empty()
        //     for (i = 0; i < allIncomeStreams.length; i++) {
        //         txtValue = allIncomeStreams[i][1];
        //         if (filter.length>0 && txtValue.toUpperCase().indexOf(filter) > -1) {
        //             option = `<li onclick="selectIncomeDetails(${i})">${txtValue}</li>`
        //             incomeDetailsOptions.append(option)
        //         } else {
        //             // 
        //         }
        //     }
        // })
        // $("#bank_input").keyup(function (e) {
        //     input = document.getElementById('bank_input');
        //     filter = input.value.toUpperCase();
        //     bankOptions = $("#bankOptions")
        //     bankOptions.empty()
        //     for (i = 0; i < allBanks.length; i++) {
        //         txtValue = allBanks[i][1];
        //         if (filter.length>0 && txtValue.toUpperCase().indexOf(filter) > -1) {
        //             option = `<li onclick="selectBank(${i})">${txtValue}</li>`
        //             bankOptions.append(option)
        //         } else {
        //             // 
        //         }
        //     }
        // })

        // $('#income_category_select').change(function (e) {
        //     let inputSelect = document.getElementById('income_category_select');
        //     let s = inputSelect.value;
        //     console.log(s)
        // })


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
    
        function sendIncomeRequest(e) {
            e.preventDefault();

            let inputName = document.getElementById('name_input');
            
            let gs = document.getElementsByName('gender');    
            for(i = 0; i < gs.length; i++) {
                if(gs[i].checked)
                gender_value = gs[i].value
            }

            let fatherId = document.getElementById('parent_male_select').value;
            let newFatherCheck = document.getElementById('new_parent_male_check').checked;         
            let newFatherName = document.getElementById('new_parent_male_input').value;
            let noFatherCheck =  document.getElementById('no_parent_male_check').checked;

            let motherId = document.getElementById('parent_female_select').value;
            let newMotherCheck = document.getElementById('new_parent_female_check').checked;         
            let newMotherName = document.getElementById('new_parent_female_input').value;
            let noMotherCheck =  document.getElementById('no_parent_female_check').checked;

            let generationLevel = document.getElementById('generation_level_input').value;            
            let birthRank = document.getElementById('birth_rank_input').value;

            let spouse_values = [];
            let spouses = document.getElementsByName('spouse');   
            for(i = 0; i < spouses.length; i++) {
                if(spouses[i].checked)
                spouse_values.push(spouses[i].value)
            }
            

            let form_data = new FormData();
            form_data.append("name", inputName.value);
            form_data.append("genderValue", gender_value);

            form_data.append("fatherId", parseInt(fatherId));
            form_data.append("newFatherCheck", newFatherCheck);
            form_data.append("newFatherName", newFatherName);
            form_data.append("noFatherCheck", noFatherCheck);

            form_data.append("motherId", parseInt(motherId));
            form_data.append("newMotherCheck", newMotherCheck);
            form_data.append("newMotherName", newMotherName);
            form_data.append("noMotherCheck", noMotherCheck);

            form_data.append("generationLevel", generationLevel);
            form_data.append("birthRank", birthRank);

            form_data.append("spouseValues", spouse_values);
   
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
                url: window.location.pathname,
                type: "POST",
                data: form_data,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log("Well done !!");                
                    // console.log(noFatherCheck);  
                    // console.log(noMotherCheck);  
                    var reloadLink = document.createElement('a');
                    reloadLink.href = window.location.href
                    document.body.appendChild(reloadLink);
                    reloadLink.click();
                    reloadLink.remove();
                },
                error: function (response) {
                    alert("Something went wrong");
                }
            });
        }

        document.getElementById('create_income_btn').addEventListener("click", function(e){
            sendIncomeRequest(e)
        })

        
    })

}($));

// function selectCustomer(index) {
//     currentCustomer = allClients[index]
//     var input = document.getElementById('customer_name_input');
//     input.value = currentCustomer[1]
//     console.log(currentCustomer[1])
//     customerOptions = $("#customerOptions")
//     customerOptions.empty()
// }
// function selectIncomeDetails(index) {
//     currentIncomeStream = allIncomeStreams[index]
//     var input = document.getElementById('income_details_input');
//     input.value = currentIncomeStream[1]
//     incomeDetailsOptions = $("#incomeDetailsOptions")
//     incomeDetailsOptions.empty()
// }
// function selectBank(index) {
//     currentBank = allBanks[index]
//     var input = document.getElementById('bank_input');
//     input.value = currentBank[1]
//     bankOptions = $("#bankOptions")
//     bankOptions.empty()
// }