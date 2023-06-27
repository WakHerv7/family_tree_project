import json
import time
import os
from PIL import Image
from django.shortcuts import render, redirect
from .forms import RegisterForm, FamilyMemberForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
# START:for_download_tuto
from .models import FilesAdmin, Individu
from django.http import HttpResponseRedirect, JsonResponse
# END:for_download_tuto
# Create your views here.

# @login_required(login_url="/login")
# def home(request):
#     # START:for_download_tuto
#     context = {'file':FilesAdmin.objects.all()}
#     return render(request, 'main/home.html', context)
    # END:for_download_tuto

# START:for_download_tuto
def download(request, path):
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    if os.path.exists(file_path):
        with open(file_path, 'ro') as fh:
            response = HttpResponse(fh.read(), content_type="application/adminupload")
            response['Content-Disposition'] = 'inline;filename='+os.path.basename(file_path)
            return response
    
    raise Http404
# END:for_download_tuto

def sign_up(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('/home')
    else:
        form = RegisterForm()
    return render(request, 'registration/sign_up.html', {"form":form})




# ############################################################################################33
# ############################################################################################33
# ############################################################################################33

def Family(request):

    PARENT_MALES = []
    for pm in Individu.objects.filter(gender='m'):
        PARENT_MALES.append((pm.id, pm.name))

    PARENT_FEMALES = []
    for pm in Individu.objects.filter(gender='f'):
        PARENT_FEMALES.append((pm.id, pm.name))

    SPOUSES = []
    for pm in Individu.objects.all():
        SPOUSES.append((pm.id, pm.name))
    
    if request.method == 'POST':
        # print("WE ARE IN A POST METHOD !!!   WE ARE IN A POST METHOD !!!   WE ARE IN A POST METHOD !!!")
        form = FamilyMemberForm(PARENT_MALES, PARENT_FEMALES, SPOUSES, request.POST)        
        # if form.is_valid():
        name = request.POST['name']
        genderValue = request.POST['genderValue']

        fatherId = request.POST['fatherId']
        newFatherCheck = request.POST['newFatherCheck']
        newFatherName = request.POST['newFatherName']
        noFatherCheck = request.POST['noFatherCheck']

        motherId = request.POST['motherId']
        newMotherCheck = request.POST['newMotherCheck']
        newMotherName = request.POST['newMotherName']
        noMotherCheck = request.POST['noMotherCheck']

        generationLevel = request.POST['generationLevel']
        birthRank = request.POST['birthRank']
        spouseValues = request.POST['spouseValues']

        # print("WE'VE REACHED TILL HERE !!!")             
        # print("WE'VE REACHED TILL HERE !!!")             
        # print("WE'VE REACHED TILL HERE !!!")

        # teku = Individu.objects.get(id=3)
        # teku.spouses.set([4])
        # teku.save()
        
        if noFatherCheck == 'true':
            fatherId = None
            # print("fatherId = None!!!")
            # print(noFatherCheck)
        elif newFatherCheck == 'true':
            indiv = Individu(
                name = newFatherName,
                gender = 'm'
            )
            indiv.save() 
            fatherId = indiv.id

        if noMotherCheck == 'true':
            motherId = None
            # print("motherId = None!!!")
            # print(noMotherCheck)
        elif newMotherCheck == 'true':
            indiv = Individu(
                name = newMotherName,
                gender = 'f'
            )
            indiv.save() 
            motherId = indiv.id

        fm = Individu(
            name = name,
            gender = genderValue,
            generation = None if generationLevel == '' else generationLevel,
            parent_male_id = fatherId,
            parent_female_id = motherId,
            birth_rank = None if birthRank == '' else birthRank
        )
        fm.save()
        fm.spouses.set(spouseValues)
        fm.save()
                        
        # return HttpResponseRedirect(request.path_info)
        return JsonResponse({"message": "Success"}, status = 200)
    else:
        form = FamilyMemberForm(PARENT_MALES, PARENT_FEMALES, SPOUSES)        
        # incs = Income.objects.filter(company_id=companyId)
        FAMILY = []
        FAMILY_GENERATIONS = []
        GENERATION_0 = []
        for indiv in Individu.objects.all():  

            indiv_spouses = []
            for pm in indiv.spouseslist:
                indiv_spouses.append(pm.id)
                    
            indivItem = {
                "id": indiv.id,
                "name": indiv.name,
                "gender": indiv.gender,
                "father": indiv.parent_male_id,
                "mother": indiv.parent_female_id,
                "spouses": indiv_spouses,
                "generation": None
            }

            # If Indiv has no parent and his/her spouse has no parent too then he's Generation 0
            if not indiv.parent_male_id and not indiv.parent_female_id:
                sp_flag = False
                if len(indiv_spouses)  > 0 :                    
                    for isp in indiv_spouses:
                        isp_obj = Individu.objects.get(id=isp)
                        if isp_obj.parent_male_id or isp_obj.parent_female_id:
                            # flag=True if Indiv spouse has a parent => then Indiv is not of Generation 0
                            sp_flag = True

                # flag=False => Indiv spouse has no parent => then Indiv is of Generation 0
                if not sp_flag:
                    indivItem["generation"] = 0
                    GENERATION_0.append(indiv.id)

            # print("income list loop ongoing !!")
            FAMILY.append(indivItem)


        FAMILY_GENERATIONS.append(GENERATION_0)

        unsolved_generations = False
        for idf in FAMILY:
            if idf["generation"] == None:
                # unsolved_generations=True if there are family members which Generation=None
                unsolved_generations = True
                break

        fgi = 0
        # while there are family members which Generation=None
        while unsolved_generations:
            NEW_GEN = []
            for indfam in FAMILY:
                # Go through all family members
                for ig0 in FAMILY_GENERATIONS[fgi]:
                    # Go through family members of the previous generation
                    currentIndiv = None
                    for ig0item in FAMILY:
                        if ig0item["id"] == ig0:
                            currentIndiv = ig0item
                            break
                    if indfam["father"] == ig0 or indfam["mother"] == ig0:
                        # If family member's father/mother belongs to the previous generation, then he/she belongs to the next to it
                        indfam["generation"] = currentIndiv["generation"]+1
                        NEW_GEN.append(indfam["id"])
                        if len(indfam["spouses"]) > 0:
                            for isp in indfam["spouses"]:
                                for spitem in FAMILY:
                                    if spitem["id"] == isp:
                                        # family member spouse belongs to the same generation as him
                                        spitem["generation"] = currentIndiv["generation"]+1
                                        NEW_GEN.append(spitem["id"])
                                        break
            
            # Remove duplicates
            NEW_GEN = list(dict.fromkeys(NEW_GEN))
            # Add new gen to FAMILY_GENERATIONS
            FAMILY_GENERATIONS.append(NEW_GEN)
            # Check if there's still unsolved_generations
            unsolved_generations = False
            for idf in FAMILY:
                if idf["generation"] == None:
                    unsolved_generations = True
                    fgi += 1
                    break

        # Number of generations
        nb_gen = len(FAMILY_GENERATIONS)
        # Get the largest generation        
        largest_gen = {"rank":0, "size":0}
        for index, fg in enumerate(FAMILY_GENERATIONS):
            if len(fg) >= largest_gen["size"]:
                # print(fg)
                # print(len(fg))
                largest_gen["rank"]= index
                largest_gen["size"]= len(fg)
        
        print(largest_gen)
        print(nb_gen)

        context = {"form":form, "family": FAMILY, "len_family":len(FAMILY)}
        return render(request, 'main/home.html', context)



# ############################################################################################33
# ############################################################################################33
# ############################################################################################33

def NewFamilyMember(request, document_root):
    if request.method == 'POST':
        # print("WE ARE IN A POST METHOD !!!   WE ARE IN A POST METHOD !!!   WE ARE IN A POST METHOD !!!")
        # form = FamilyMemberForm(PARENT_MALES, PARENT_FEMALES, SPOUSES, request.POST)        
        
        currentMemberId = request.POST['currentMemberId']
        urlLastButOneItem = request.POST['urlLastButOneItem']
        myName = request.POST['myName']
        myGender = request.POST['myGender']
        myLifeStatus = request.POST['myLifeStatus']
        isIncomingSpouse = request.POST['isIncomingSpouse']
        noPhotoCheck = False if request.POST['noPhotoCheck'] == 'false' else True
        uploadedPhotoName = request.POST['uploadedPhotoName']        
        # print("*********************************************************")
        # print(uploadedPhotoName)
        # print("*********************************************************")
        uploadedPhoto = request.FILES['uploadedPhoto'] if uploadedPhotoName != 'undefined' else False

        fatherId = request.POST['fatherId']
        newFatherCheck = request.POST['newFatherCheck']
        newFatherName = request.POST['newFatherName']
        hasFatherCheck = request.POST['hasFatherCheck']
        fatherLifeStatusValue = request.POST['fatherLifeStatusValue']

        motherId = request.POST['motherId']
        newMotherCheck = request.POST['newMotherCheck']
        newMotherName = request.POST['newMotherName']
        hasMotherCheck = request.POST['hasMotherCheck']
        motherLifeStatusValue = request.POST['motherLifeStatusValue']

        spouseValues = request.POST['spouseValues']

        birthdate = request.POST['birthdate']
        birthplace = request.POST['birthplace']
        birthrank = request.POST['birthrank']
        email = request.POST['email']
        telephone = request.POST['telephone']
        profession = request.POST['profession']
        country = request.POST['country']
        city = request.POST['city']
        linkedin = request.POST['linkedin']
        twitter = request.POST['twitter']
        facebook = request.POST['facebook']
        instagram = request.POST['instagram']
        aboutme = request.POST['aboutme']


        if hasFatherCheck == 'false':
            fatherId = None        
        elif newFatherCheck == 'true' and urlLastButOneItem != 'new_spouse':
            lv = lifeValue(fatherLifeStatusValue)
            indiv = Individu(
                name = newFatherName,
                gender = 'm',
                dead = lv["dv"],
                youngdead = lv["ydv"]
            )
            indiv.save() 
            fatherId = indiv.id
        else:
            fatherId = None

        if hasMotherCheck == 'false':
            motherId = None
        elif newMotherCheck == 'true' and urlLastButOneItem != 'new_spouse':            
            lv = lifeValue(motherLifeStatusValue)
            indiv = Individu(
                name = newMotherName,
                gender = 'f',
                dead = lv["dv"],
                youngdead = lv["ydv"]
            )
            indiv.save() 
            motherId = indiv.id
        else:
            motherId = None

        my_lv = lifeValue(myLifeStatus)
        
        # Modify family member
        if currentMemberId != 'null' and urlLastButOneItem == 'update_item':
            cmo = Individu.objects.get(id=currentMemberId)
            cmo.name = myName
            cmo.gender = myGender
            cmo.dead = my_lv["dv"]
            cmo.youngdead = my_lv["ydv"]
            cmo.generation = None
            cmo.parent_male_id = fatherId
            cmo.parent_female_id = motherId
            cmo.birth_rank = None if birthrank == '' else birthrank
            cmo.birth_date = None if birthdate == '' else birthdate
            cmo.birth_place = birthplace
            cmo.email = email
            cmo.telephone = telephone
            cmo.profession = profession
            cmo.country = country
            cmo.city = city
            cmo.linkedin = linkedin
            cmo.twitter = twitter
            cmo.facebook = facebook
            cmo.instagram = instagram
            cmo.aboutme = aboutme
            # cmo.isIncomingSpouse = False if isIncomingSpouse == 'false' else True,

            if cmo.isIncomingSpouse :
                cmo.sFatherName = newFatherName
                cmo.sMotherName = newMotherName
                mlv = lifeValue(motherLifeStatusValue)
                flv = lifeValue(fatherLifeStatusValue)
                cmo.sFatherDead = flv["dv"]
                cmo.sMotherDead = mlv["dv"]

            # cmo.isIncomingSpouse = False if isIncomingSpouse == 'false' else True,
            print('*********************************************************************')
            print(noPhotoCheck)
            print('*********************************************************************')
            if noPhotoCheck:
                cmo.photoName = None
                cmo.photoPath.delete()
            else:
                if uploadedPhoto:
                    if cmo.photoPath:
                        cmo.photoPath.delete()
                
                    timestr = time.strftime("%Y%m%d-%H%M%S")
                    photoName = 'Photo-'+timestr+".jpg"                
                    pathToConvertedFiles = os.path.join(document_root,'photos', photoName)
                    relativePathToConvertedFiles = os.path.join('photos', photoName)

                    img = Image.open(uploadedPhoto)
                    img = img.convert('RGB')
                    img.thumbnail((256, 256))
                    img.save(pathToConvertedFiles)                
                    cmo.photoName = photoName
                    cmo.photoPath.name = relativePathToConvertedFiles
            # ######################
            SVs = []
            # print("WE ARE IN A PATCH METHOD !!!   WE ARE IN A PATCH METHOD !!!   WE ARE IN A PATCH METHOD !!!")
            # print(json.loads(spouseValues))
            # print(spouseValues[0])
            for sve in json.loads(spouseValues):
                # print("WE ARE IN A PATCH METHOD !!!   WE ARE IN A PATCH METHOD !!!   WE ARE IN A PATCH METHOD !!!")
                # print(sve)
                # print("WE ARE IN A PATCH METHOD !!!   WE ARE IN A PATCH METHOD !!!   WE ARE IN A PATCH METHOD !!!")
                # SVs.append(int(sv["conjointId"]))
                if sve["newConjointCheck"] == 'true':
                    lv = lifeValue(sve["status"])
                    indiv = Individu(
                        name = sve["newConjointName"],
                        gender = sve["gender"],
                        dead = lv["dv"],
                        youngdead = lv["ydv"]
                    )
                    indiv.save()
                    SVs.append(indiv.id)
                else:
                    SVs.append(int(sve["conjointId"]))
            cmo.spouses.set(SVs)            
            cmo.save()
            # ######################
        else:
            # Create a new family member
            fm = Individu(
                name = myName,
                gender = myGender,
                dead = my_lv["dv"],
                youngdead = my_lv["ydv"],
                generation = None,
                parent_male_id = fatherId,
                parent_female_id = motherId,
                birth_rank = None if birthrank == '' else birthrank,
                birth_date = None if birthdate == '' else birthdate,
                birth_place = birthplace,
                email = email,
                telephone = telephone,
                profession = profession,
                country = country,
                city = city,
                linkedin = linkedin,
                twitter = twitter,
                facebook = facebook,
                instagram = instagram,
                aboutme = aboutme,
                isIncomingSpouse = False if isIncomingSpouse == 'false' else True,                               
            )
            if urlLastButOneItem == 'new_spouse' :
                fm.isIncomingSpouse = True
                fm.sFatherName = newFatherName
                fm.sMotherName = newMotherName
                mlv = lifeValue(motherLifeStatusValue)
                flv = lifeValue(fatherLifeStatusValue)
                fm.sFatherDead = flv["dv"]
                fm.sMotherDead = mlv["dv"]

            
            if not(noPhotoCheck) and uploadedPhoto:
                # cmo = Individu.objects.get(id=fm.id)
                timestr = time.strftime("%Y%m%d-%H%M%S")
                photoName = 'Photo-'+timestr+".jpg"
                pathToConvertedFiles = os.path.join(document_root,'photos', photoName)
                relativePathToConvertedFiles = os.path.join('photos', photoName)
                img = Image.open(uploadedPhoto)
                img = img.convert('RGB')
                img.thumbnail((256, 256))
                img.save(pathToConvertedFiles)

                fm.photoName = photoName
                fm.photoPath.name = relativePathToConvertedFiles
                
            fm.save()      
            # ######################
            SVs = []
            for sv in json.loads(spouseValues):
                # SVs.append(int(sv["conjointId"]))
                if sv["newConjointCheck"] == 'true':
                    lv = lifeValue(sv["status"])
                    indiv = Individu(
                        name = sv["newConjointName"],
                        gender = sv["gender"],
                        dead = lv["dv"],
                        youngdead = lv["ydv"]
                    )
                    indiv.save()
                    SVs.append(indiv.id)
                else:
                    SVs.append(int(sv["conjointId"]))

            fm.spouses.set(SVs)
            fm.save()
            # ######################
                        
        # return HttpResponseRedirect(request.path_info)
        return JsonResponse({"message": "Success"}, status = 200)
    else:
        return render(request, 'main/new_fm.html')



# ############################################################################################33
# ############################################################################################33
# ############################################################################################33

def FamilyTree(request):
    return render(request, 'main/family_tree.html')



# ############################################################################################33
# ############################################################################################33
# ############################################################################################33

def FamilyData(request):
    FAMILY = []
    FAMILY_GENERATIONS = []
    GENERATION_0 = []
    for indiv in Individu.objects.all():  

        indiv_spouses = []
        for pm in indiv.spouseslist:
            indiv_spouses.append(pm.id)
                
        indivItem = {
            "id": indiv.id,
            "name": indiv.name,
            "gender": indiv.gender,
            "father": indiv.parent_male_id,
            "mother": indiv.parent_female_id,
            "spouses": indiv_spouses,
            "generation": None,
            "dead": indiv.dead,
            "photo": indiv.photoPath.url if indiv.photoName else None,
            "isIncomingSpouse": indiv.isIncomingSpouse,
        }

        # If Indiv has no parent and his/her spouse has no parent too then he's Generation 0
        if not indiv.parent_male_id and not indiv.parent_female_id:
            sp_flag = False
            if len(indiv_spouses)  > 0 :                    
                for isp in indiv_spouses:
                    isp_obj = Individu.objects.get(id=isp)
                    if isp_obj.parent_male_id or isp_obj.parent_female_id:
                        # flag=True if Indiv spouse has a parent => then Indiv is not of Generation 0
                        sp_flag = True

            # flag=False => Indiv spouse has no parent => then Indiv is of Generation 0
            if not sp_flag:
                indivItem["generation"] = 0
                GENERATION_0.append(indiv.id)

        # print("income list loop ongoing !!")
        FAMILY.append(indivItem)


    FAMILY_GENERATIONS.append(GENERATION_0)

    unsolved_generations = False
    for idf in FAMILY:
        if idf["generation"] == None:
            # unsolved_generations=True if there are family members which Generation=None
            unsolved_generations = True
            break

    fgi = 0
    # while there are family members which Generation=None
    while unsolved_generations:
        NEW_GEN = []
        for indfam in FAMILY:
            # Go through all family members
            for ig0 in FAMILY_GENERATIONS[fgi]:
                # Go through family members of the previous generation
                currentIndiv = None
                for ig0item in FAMILY:
                    if ig0item["id"] == ig0:
                        currentIndiv = ig0item
                        break
                if indfam["father"] == ig0 or indfam["mother"] == ig0:
                    # If family member's father/mother belongs to the previous generation, then he/she belongs to the next to it
                    indfam["generation"] = currentIndiv["generation"]+1
                    NEW_GEN.append(indfam["id"])
                    if len(indfam["spouses"]) > 0:
                        for isp in indfam["spouses"]:
                            for spitem in FAMILY:
                                if spitem["id"] == isp:
                                    # family member spouse belongs to the same generation as him
                                    spitem["generation"] = currentIndiv["generation"]+1
                                    NEW_GEN.append(spitem["id"])
                                    break
        
        # Remove duplicates
        NEW_GEN = list(dict.fromkeys(NEW_GEN))
        # Add new gen to FAMILY_GENERATIONS
        FAMILY_GENERATIONS.append(NEW_GEN)
        # Check if there's still unsolved_generations
        unsolved_generations = False
        for idf in FAMILY:
            if idf["generation"] == None:
                unsolved_generations = True
                fgi += 1
                break

    # Number of generations
    nb_gen = len(FAMILY_GENERATIONS)
    # Get the largest generation        
    largest_gen = {"rank":0, "size":0}
    for index, fg in enumerate(FAMILY_GENERATIONS):
        if len(fg) >= largest_gen["size"]:
            # print(fg)
            # print(len(fg))
            largest_gen["rank"]= index
            largest_gen["size"]= len(fg)
    
    # print(largest_gen)
    # print(nb_gen)

    return JsonResponse({
        "family":FAMILY, 
        "familyGenerations":FAMILY_GENERATIONS, 
        "largest_gen": largest_gen,
        "nb_gen": nb_gen,
        }, 
        status = 200)



def FamilyFormData(request):
    ALL = {
        "all":[],
        "alive": [],
        "dead": [],
        "youngdead": [],
    }
    MALES = {
        "all":[],
        "alive": [],
        "dead": [],
        "youngdead": [],
    }
    FEMALES = {
        "all":[],
        "alive": [],
        "dead": [],
        "youngdead": [],
    }

    for indiv in Individu.objects.all():
        idv =  {"id": indiv.id, "name": indiv.name}
        ALL["all"].append(idv)

        if indiv.gender == 'm':
            MALES["all"].append(idv)
            if indiv.dead == False:
                ALL["alive"].append(idv)                
                MALES["alive"].append(idv)
            elif indiv.dead == True:
                if indiv.youngdead == False:
                    ALL["dead"].append(idv)
                    MALES["dead"].append(idv)
                elif indiv.youngdead == True:
                    ALL["youngdead"].append(idv)
                    MALES["youngdead"].append(idv)

        elif indiv.gender == 'f':
            FEMALES["all"].append(idv)
            if indiv.dead == False:
                ALL["alive"].append(idv)                
                FEMALES["alive"].append(idv)
            elif indiv.dead == True:
                if indiv.youngdead == False:
                    ALL["dead"].append(idv)
                    FEMALES["dead"].append(idv)
                elif indiv.youngdead == True:
                    ALL["youngdead"].append(idv)
                    FEMALES["youngdead"].append(idv)



    # ###########
    currentMemberId = request.GET['currentMemberId']
    cm = {}
    if currentMemberId != 'none':
        cmo = Individu.objects.get(id=currentMemberId)
        # #####################
        cmoFather = None
        cmoMother = None
        if cmo.parent_male_id :
            cmoFather = Individu.objects.get(id=cmo.parent_male_id)
        if cmo.parent_female_id :
            cmoMother = Individu.objects.get(id=cmo.parent_female_id)
        # ############################
        cmoSpouses = []
        for cmosp in cmo.spouseslist:
            spouseObject = Individu.objects.get(id=cmosp.id)
            spouse = {
                "id":spouseObject.id,
                "name": spouseObject.name,
                "gender": spouseObject.gender,
                "status": lifeStatusFrontend(spouseObject.dead, spouseObject.youngdead),
            }
            cmoSpouses.append(spouse)

        cm = {
            "myPhoto": cmo.photoPath.url if cmo.photoPath else None,
            "myName": cmo.name,
            "myGender": cmo.gender,
            "myLifeStatus": lifeStatusFrontend(cmo.dead, cmo.youngdead),
            "father": {
                "id": None if cmoFather == None else cmoFather.id,
                "name": None if cmoFather == None else cmoFather.name,
                "gender": None if cmoFather == None else cmoFather.gender,
                "status": None if cmoFather == None else lifeStatusFrontend(cmoFather.dead, cmoFather.youngdead),
            },
            "mother": {
                "id": None if cmoMother == None else cmoMother.id,
                "name": None if cmoMother == None else cmoMother.name,
                "gender": None if cmoMother == None else cmoMother.gender,
                "status": None if cmoMother == None else lifeStatusFrontend(cmoMother.dead, cmoMother.youngdead),
            },
            
            "spouses": cmoSpouses,
            "birthrank": cmo.birth_rank,
            "birthdate": cmo.birth_date,
            "birthplace": cmo.birth_place,
            "email": cmo.email,
            "telephone": cmo.telephone,
            "profession": cmo.profession,
            "country": cmo.country,
            "city": cmo.city,
            "linkedin": cmo.linkedin,
            "twitter": cmo.twitter,
            "facebook": cmo.facebook,
            "instagram": cmo.instagram,
            "aboutme": cmo.aboutme,
            "isIncomingSpouse": cmo.isIncomingSpouse,
            "sFatherName": cmo.sFatherName,
            "sFatherStatus": lifeStatusFrontend(cmo.sFatherDead, False),
            "sMotherName": cmo.sMotherName,
            "sMotherStatus": lifeStatusFrontend(cmo.sMotherDead, False),
        }


    return JsonResponse({
        "allMembers":ALL, 
        "allMales":MALES, 
        "allFemales": FEMALES,
        "currentMember": cm,
        }, 
        status = 200)
    


def FamilyList(request):
    FAMILY = []
    FAMILY_GENERATIONS = []
    GENERATION_0 = []
    for indiv in Individu.objects.all():  

        indiv_spouses = []
        for pm in indiv.spouseslist:
            indiv_spouses.append(pm.id)
                
        indivItem = {
            "id": indiv.id,
            "name": indiv.name,
            "gender": indiv.gender,
            "alive": not indiv.dead,
            "father": indiv.parent_male_id,
            "mother": indiv.parent_female_id,
            "spouses": indiv_spouses,
            "generation": None
        }

        # If Indiv has no parent and his/her spouse has no parent too then he's Generation 0
        if not indiv.parent_male_id and not indiv.parent_female_id:
            sp_flag = False
            if len(indiv_spouses)  > 0 :                    
                for isp in indiv_spouses:
                    isp_obj = Individu.objects.get(id=isp)
                    if isp_obj.parent_male_id or isp_obj.parent_female_id:
                        # flag=True if Indiv spouse has a parent => then Indiv is not of Generation 0
                        sp_flag = True

            # flag=False => Indiv spouse has no parent => then Indiv is of Generation 0
            if not sp_flag:
                indivItem["generation"] = 0
                GENERATION_0.append(indiv.id)

        # print("income list loop ongoing !!")
        FAMILY.append(indivItem)


    FAMILY_GENERATIONS.append(GENERATION_0)

    unsolved_generations = False
    for idf in FAMILY:
        if idf["generation"] == None:
            # unsolved_generations=True if there are family members which Generation=None
            unsolved_generations = True
            break

    fgi = 0
    # while there are family members which Generation=None
    while unsolved_generations:
        NEW_GEN = []
        for indfam in FAMILY:
            # Go through all family members
            for ig0 in FAMILY_GENERATIONS[fgi]:
                # Go through family members of the previous generation
                currentIndiv = None
                for ig0item in FAMILY:
                    if ig0item["id"] == ig0:
                        currentIndiv = ig0item
                        break
                if indfam["father"] == ig0 or indfam["mother"] == ig0:
                    # If family member's father/mother belongs to the previous generation, then he/she belongs to the next to it
                    indfam["generation"] = currentIndiv["generation"]+1
                    NEW_GEN.append(indfam["id"])
                    if len(indfam["spouses"]) > 0:
                        for isp in indfam["spouses"]:
                            for spitem in FAMILY:
                                if spitem["id"] == isp:
                                    # family member spouse belongs to the same generation as him
                                    spitem["generation"] = currentIndiv["generation"]+1
                                    NEW_GEN.append(spitem["id"])
                                    break
        
        # Remove duplicates
        NEW_GEN = list(dict.fromkeys(NEW_GEN))
        # Add new gen to FAMILY_GENERATIONS
        FAMILY_GENERATIONS.append(NEW_GEN)
        # Check if there's still unsolved_generations
        unsolved_generations = False
        for idf in FAMILY:
            if idf["generation"] == None:
                unsolved_generations = True
                fgi += 1
                break

    # Number of generations
    nb_gen = len(FAMILY_GENERATIONS)
    # Get the largest generation        
    largest_gen = {"rank":0, "size":0}
    for index, fg in enumerate(FAMILY_GENERATIONS):
        if len(fg) >= largest_gen["size"]:
            # print(fg)
            # print(len(fg))
            largest_gen["rank"]= index
            largest_gen["size"]= len(fg)
    
    # print(largest_gen)
    # print(nb_gen)
    context = {
        "family":FAMILY, 
        "familyGenerations":FAMILY_GENERATIONS, 
        "largest_gen": largest_gen,
        "nb_gen": nb_gen,
        "len_family":len(FAMILY),
    }
    return render(request, 'main/family_list.html', context)


def newChild(request, pk):
    return render(request, 'main/new_fm.html')

def newSpouse(request, pk):
    return render(request, 'main/new_fm.html')


def deleteItem(request, pk):
    indiv = Individu.objects.get(id=pk)
    indiv.delete()
    return redirect('family_list')

def updateItem(request, pk):
    return render(request, 'main/new_fm.html')

def showItem(request, pk):
    cmo = Individu.objects.get(id=pk)
    # #####################
    cmoFather = None
    cmoMother = None
    if cmo.parent_male_id :
        cmoFather = Individu.objects.get(id=cmo.parent_male_id)
    if cmo.parent_female_id :
        cmoMother = Individu.objects.get(id=cmo.parent_female_id)
    # ############################
    cmoSpouses = []
    for cmosp in cmo.spouseslist:
        spouseObject = Individu.objects.get(id=cmosp.id)
        spouse = {
            "id":spouseObject.id,
            "name": spouseObject.name,
            "gender": genderFrontend(spouseObject.gender),
            "status": lifeStatusFrontend(spouseObject.dead, spouseObject.youngdead, spouseObject.gender),
        }
        cmoSpouses.append(spouse)

    cm = {
        "myPhoto": cmo.photoPath.url if cmo.photoPath else None,
        "myID": cmo.id,
        "myName": cmo.name,
        "myInitials": getFirst2Initials(cmo.name),
        "myGender": genderFrontend(cmo.gender),
        "myLifeStatus": lifeStatusFrontend(cmo.dead, cmo.youngdead, cmo.gender),
        "father": {
            "id": None if cmoFather == None else cmoFather.id,
            "name": None if cmoFather == None else cmoFather.name,
            "gender": None if cmoFather == None else genderFrontend(cmoFather.gender),
            "status": None if cmoFather == None else lifeStatusFrontend(cmoFather.dead, cmoFather.youngdead, cmoFather.gender),
        },
        "mother": {
            "id": None if cmoMother == None else cmoMother.id,
            "name": None if cmoMother == None else cmoMother.name,
            "gender": None if cmoMother == None else genderFrontend(cmoMother.gender),
            "status": None if cmoMother == None else lifeStatusFrontend(cmoMother.dead, cmoMother.youngdead, cmoMother.gender),
        },
        
        "spouses": cmoSpouses,
        "len_spouses": len(cmoSpouses),
        "birthrank": '' if cmo.birth_rank == None else cmo.birth_rank,
        "birthdate": '' if cmo.birth_date == None else cmo.birth_date,
        "birthplace": '' if cmo.birth_place == None else cmo.birth_place,
        "email": '' if cmo.email == None else cmo.email,
        "telephone": '' if cmo.telephone == None else cmo.telephone,
        "profession": '' if cmo.profession == None else cmo.profession,
        "country": '' if cmo.country == None else cmo.country,
        "city": '' if cmo.city == None else cmo.city,
        "linkedin": '' if cmo.linkedin == None else cmo.linkedin,
        "twitter": '' if cmo.twitter == None else cmo.twitter,
        "facebook": '' if cmo.facebook == None else cmo.facebook,
        "instagram": '' if cmo.instagram == None else cmo.instagram,
        "aboutme": '' if cmo.aboutme == None else cmo.aboutme,
    }

    if cmo.isIncomingSpouse :
        import random

        cm["father"]["id"] = random.randint(300, 700)
        cm["father"]["name"] = cmo.sFatherName
        cm["father"]["status"] = lifeStatusFrontend(cmo.sFatherDead, False, 'm')
        cm["mother"]["id"] = random.randint(300, 700)
        cm["mother"]["name"] = cmo.sMotherName
        cm["mother"]["status"] = lifeStatusFrontend(cmo.sMotherDead, False, 'f')

    return render(request, 'main/show_fm.html', cm)

def getFirst2Initials(name) :
    w = ''
    namesTab = name.split(' ')
    for idx,item  in enumerate(namesTab):
        if idx < 2:
            w = w + namesTab[idx][0]
    w = w.upper()
    return w

def lifeStatusFrontend(dv, ydv, gend=None):
    if gend == None : 
        if dv == False:
            return 'vie'
        elif dv == True:
            if ydv == False:
                return 'mort'
            else:
                return 'mba'
    elif gend == 'm':
        if dv == False:
            return 'En vie'
        elif dv == True:
            if ydv == False:
                return 'Mort'
            else:
                return 'Mort à bas âge'
    elif gend == 'f':
        if dv == False:
            return 'En vie'
        elif dv == True:
            if ydv == False:
                return 'Morte'
            else:
                return 'Morte à bas âge'

def genderFrontend(gend):
    if gend == 'm':
       return 'Masculin' 
    elif gend == 'f':
        return 'Feminin'


def lifeValue(data):
    deadValue = False
    youngdeadValue = False
    
    if data == 'vie':
        deadValue = False
    elif data == 'mort':
        deadValue = True
    elif data == 'mba':
        deadValue = True
        youngdeadValue = True

    return {"dv": deadValue, "ydv":youngdeadValue}