(function ($) {
    $(document).ready(function ($) {

        
        function getFamilyMemebers() {
            $.ajax({
                type: 'GET',
                url: "family_data",
                data: {},
                success: function (response) {
                    
                },
                error: function (response) {
                    console.log(response)
                }
            })
        }
        setTimeout(() => {
            getFamilyMemebers()
        }, 500);


        
    })

}($));

function openDeleteModal(evt, id, name) {
    evt.preventDefault();
    document.getElementById(`modal_container`).classList.remove('displayNone')    
    document.getElementById(`fmName`).innerText = name
    document.getElementById(`delete_fm_btn`).setAttribute('href', `delete_item/${id}`)
}
function closeDeleteModal(evt) {
    evt.preventDefault();
    document.getElementById(`modal_container`).classList.add('displayNone')  
}