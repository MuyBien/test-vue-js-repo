<template>
  <tr class="player">
    <td class="player_infos">
      <p class="player_infos__number">
        {{ playerIndex + 1 }}
      </p>
      <div class="player_infos__club_jersey" />
      <p class="player_infos__name">
        {{ player.lastName }}
      </p>
      <div class="player_infos__additionnal">
        <p v-if="player.isCaptain" class="player_infos__additionnal__cap">
          C
        </p>
        <div v-if="player.isSubstitute" class="player_infos__additionnal__substitution">
          <svg
            width="15"
            height="15"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ><path d="M19.91 15.51H15.38C15.1148 15.51 14.8604 15.6154 14.6729 15.8029C14.4854 15.9904 14.38 16.2448 14.38 16.51C14.38 16.7752 14.4854 17.0296 14.6729 17.2171C14.8604 17.4046 15.1148 17.51 15.38 17.51H17.78C16.6769 18.6627 15.2544 19.4593 13.6952 19.7974C12.1359 20.1355 10.5112 19.9996 9.02978 19.4072C7.54834 18.8149 6.27787 17.7931 5.38159 16.4732C4.48531 15.1532 4.00418 13.5955 4 12C4 11.7348 3.89464 11.4804 3.70711 11.2929C3.51957 11.1054 3.26522 11 3 11C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2.00529 13.9528 2.58222 15.8613 3.6596 17.49C4.73699 19.1187 6.26767 20.3964 8.06274 21.1652C9.85782 21.9341 11.8387 22.1605 13.761 21.8166C15.6833 21.4727 17.4628 20.5735 18.88 19.23V21C18.88 21.2652 18.9854 21.5196 19.1729 21.7071C19.3604 21.8946 19.6148 22 19.88 22C20.1452 22 20.3996 21.8946 20.5871 21.7071C20.7746 21.5196 20.88 21.2652 20.88 21V16.5C20.8775 16.2416 20.7752 15.9943 20.5943 15.8097C20.4135 15.6251 20.1683 15.5177 19.91 15.51ZM12 2C9.43639 2.00731 6.97349 2.99891 5.12 4.77V3C5.12 2.73478 5.01464 2.48043 4.82711 2.29289C4.63957 2.10536 4.38522 2 4.12 2C3.85478 2 3.60043 2.10536 3.41289 2.29289C3.22536 2.48043 3.12 2.73478 3.12 3V7.5C3.12 7.76522 3.22536 8.01957 3.41289 8.20711C3.60043 8.39464 3.85478 8.5 4.12 8.5H8.62C8.88522 8.5 9.13957 8.39464 9.32711 8.20711C9.51464 8.01957 9.62 7.76522 9.62 7.5C9.62 7.23478 9.51464 6.98043 9.32711 6.79289C9.13957 6.60536 8.88522 6.5 8.62 6.5H6.22C7.32247 5.34787 8.74409 4.5515 10.3024 4.21311C11.8607 3.87472 13.4846 4.00975 14.9656 4.60086C16.4466 5.19198 17.7172 6.21221 18.6142 7.5306C19.5113 8.849 19.9938 10.4054 20 12C20 12.2652 20.1054 12.5196 20.2929 12.7071C20.4804 12.8946 20.7348 13 21 13C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z" fill="#959DAF" /></svg>
        </div>
        <div class="player_infos__additionnal__goals">
          <svg
            v-for="goal in (player.goals - goalSaved)"
            :key="goal"
            width="20"
            height="20"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M18.4285 11.9849V12.1016C18.3696 13.7737 17.6615 15.3571 16.4545 16.5158C15.2475 17.6746 13.6365 18.3174 11.9633 18.308C10.2902 18.2986 8.68651 17.6377 7.49259 16.4654C6.29867 15.2932 5.60844 13.7019 5.56836 12.0292C5.56836 12.0137 5.56836 11.9981 5.56836 11.9826C5.56836 10.2764 6.24612 8.64016 7.45254 7.43374C8.65896 6.22732 10.2952 5.54956 12.0014 5.54956C13.7075 5.54956 15.3438 6.22732 16.5502 7.43374C17.7566 8.64016 18.4344 10.2764 18.4344 11.9826L18.4285 11.9849Z"
            fill="white"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
          /><path
            d="M12.0455 9.76477L14.2003 11.3304L13.3766 13.8621H10.7143L9.89062 11.3304L12.0455 9.76477Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M14.2003 6.04425L12.0455 7.61108L9.89062 6.04425L9.94313 5.89142C11.3134 5.43118 12.7984 5.44391 14.1606 5.92758L14.2003 6.04425Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M7.9192 10.6083L5.76437 12.1739L5.56837 12.0304V11.9838C5.56616 10.5705 6.03175 9.1963 6.89253 8.07544H7.0967L7.9192 10.6083Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M10.3192 17.9921L10.1197 18.1367C8.76022 17.72 7.57678 16.8651 6.75391 15.7054L6.83324 15.4592H9.49557L10.3192 17.9921Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M17.3097 15.6156C16.5003 16.8025 15.3172 17.6847 13.9485 18.1216L13.7759 17.9967L14.5984 15.4592H17.2607L17.3097 15.6156Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M18.4334 11.9849V12.1016L18.3272 12.1786L16.1724 10.6083L16.996 8.07544H17.1127C17.9735 9.1963 18.4391 10.5705 18.4369 11.9838L18.4334 11.9849Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M12.0913 9.71929V7.63562"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M14.1748 11.3502L16.1686 10.6257"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M13.3594 13.8877L14.6275 15.4277"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M10.732 13.8877L9.46387 15.4277"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M9.91668 11.3502L7.92285 10.6257"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /></svg>
          <svg
            v-for="ownGoal in player.ownGoals"
            :key="ownGoal"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M18.4285 11.9849V12.1016C18.3696 13.7737 17.6615 15.3571 16.4545 16.5158C15.2475 17.6746 13.6365 18.3174 11.9633 18.308C10.2902 18.2986 8.68651 17.6377 7.49259 16.4654C6.29867 15.2932 5.60844 13.7019 5.56836 12.0292C5.56836 12.0137 5.56836 11.9981 5.56836 11.9826C5.56836 10.2764 6.24612 8.64016 7.45254 7.43374C8.65896 6.22732 10.2952 5.54956 12.0014 5.54956C13.7075 5.54956 15.3438 6.22732 16.5502 7.43374C17.7566 8.64016 18.4344 10.2764 18.4344 11.9826L18.4285 11.9849Z"
            fill="white"
            stroke="#E81E29"
            stroke-width="0.644"
            stroke-miterlimit="10"
          /><path
            d="M12.0455 9.76477L14.2003 11.3304L13.3766 13.8621H10.7143L9.89062 11.3304L12.0455 9.76477Z"
            fill="#E81E29"
            stroke="#E81E29"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M14.2003 6.04425L12.0455 7.61108L9.89062 6.04425L9.94313 5.89142C11.3134 5.43118 12.7984 5.44391 14.1606 5.92758L14.2003 6.04425Z"
            fill="#E81E29"
            stroke="#E81E29"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M7.9192 10.6083L5.76437 12.1739L5.56837 12.0304V11.9838C5.56616 10.5705 6.03175 9.1963 6.89253 8.07544H7.0967L7.9192 10.6083Z"
            fill="#E81E29"
            stroke="#E81E29"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M10.3192 17.9921L10.1197 18.1367C8.76022 17.72 7.57678 16.8651 6.75391 15.7054L6.83324 15.4592H9.49557L10.3192 17.9921Z"
            fill="#E81E29"
            stroke="#E81E29"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M17.3097 15.6156C16.5003 16.8025 15.3172 17.6847 13.9485 18.1216L13.7759 17.9967L14.5984 15.4592H17.2607L17.3097 15.6156Z"
            fill="#E81E29"
            stroke="#E81E29"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M18.4334 11.9849V12.1016L18.3272 12.1786L16.1724 10.6083L16.996 8.07544H17.1127C17.9735 9.1963 18.4391 10.5705 18.4369 11.9838L18.4334 11.9849Z"
            fill="#E81E29"
            stroke="#E81E29"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M12.0913 9.71929V7.63562"
            stroke="#E81E29"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M14.1748 11.3502L16.1686 10.6257"
            stroke="#E81E29"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M13.3594 13.8877L14.6275 15.4277"
            stroke="#E81E29"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M10.732 13.8877L9.46387 15.4277"
            stroke="#E81E29"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M9.91668 11.3502L7.92285 10.6257"
            stroke="#E81E29"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /></svg>
          <svg
            v-if="scoresMpg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M18.4285 11.9849V12.1016C18.3696 13.7737 17.6615 15.3571 16.4545 16.5158C15.2475 17.6746 13.6365 18.3174 11.9633 18.308C10.2902 18.2986 8.68651 17.6377 7.49259 16.4654C6.29867 15.2932 5.60844 13.7019 5.56836 12.0292C5.56836 12.0137 5.56836 11.9981 5.56836 11.9826C5.56836 10.2764 6.24612 8.64016 7.45254 7.43374C8.65896 6.22732 10.2952 5.54956 12.0014 5.54956C13.7075 5.54956 15.3438 6.22732 16.5502 7.43374C17.7566 8.64016 18.4344 10.2764 18.4344 11.9826L18.4285 11.9849Z"
            fill="white"
            stroke="#45C945"
            stroke-width="0.644"
            stroke-miterlimit="10"
          /><path
            d="M12.0455 9.76477L14.2003 11.3304L13.3766 13.8621H10.7143L9.89062 11.3304L12.0455 9.76477Z"
            fill="#45C945"
            stroke="#45C945"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M14.2003 6.04425L12.0455 7.61108L9.89062 6.04425L9.94313 5.89142C11.3134 5.43118 12.7984 5.44391 14.1606 5.92758L14.2003 6.04425Z"
            fill="#45C945"
            stroke="#45C945"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M7.9192 10.6083L5.76437 12.1739L5.56837 12.0304V11.9838C5.56616 10.5705 6.03175 9.1963 6.89253 8.07544H7.0967L7.9192 10.6083Z"
            fill="#45C945"
            stroke="#45C945"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M10.3192 17.9921L10.1197 18.1367C8.76022 17.72 7.57678 16.8651 6.75391 15.7054L6.83324 15.4592H9.49557L10.3192 17.9921Z"
            fill="#45C945"
            stroke="#45C945"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M17.3097 15.6156C16.5003 16.8025 15.3172 17.6847 13.9485 18.1216L13.7759 17.9967L14.5984 15.4592H17.2607L17.3097 15.6156Z"
            fill="#45C945"
            stroke="#45C945"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M18.4334 11.9849V12.1016L18.3272 12.1786L16.1724 10.6083L16.996 8.07544H17.1127C17.9735 9.1963 18.4391 10.5705 18.4369 11.9838L18.4334 11.9849Z"
            fill="#45C945"
            stroke="#45C945"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M12.0913 9.71929V7.63562"
            stroke="#45C945"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M14.1748 11.3502L16.1686 10.6257"
            stroke="#45C945"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M13.3594 13.8877L14.6275 15.4277"
            stroke="#45C945"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M10.732 13.8877L9.46387 15.4277"
            stroke="#45C945"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M9.91668 11.3502L7.92285 10.6257"
            stroke="#45C945"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /></svg>
          <svg
            v-if="goalSaved"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M18.8601 12.4353V12.552C18.8012 14.2241 18.0931 15.8075 16.8861 16.9662C15.6791 18.125 14.0681 18.7678 12.3949 18.7584C10.7218 18.749 9.11815 18.0881 7.92423 16.9158C6.73031 15.7436 6.04008 14.1523 6 12.4796C6 12.4641 6 12.4485 6 12.433C6 10.7268 6.67776 9.0906 7.88418 7.88418C9.0906 6.67776 10.7268 6 12.433 6C14.1391 6 15.7754 6.67776 16.9818 7.88418C18.1882 9.0906 18.866 10.7268 18.866 12.433L18.8601 12.4353Z"
            fill="white"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
          /><path
            d="M12.4771 10.2148L14.6319 11.7805L13.8082 14.3122H11.1459L10.3223 11.7805L12.4771 10.2148Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M14.6319 6.49481L12.4771 8.06164L10.3223 6.49481L10.3748 6.34198C11.745 5.88174 13.23 5.89447 14.5922 6.37814L14.6319 6.49481Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M8.35084 11.0583L6.19601 12.6238L6.00001 12.4804V12.4338C5.9978 11.0205 6.46339 9.64625 7.32417 8.52539H7.52834L8.35084 11.0583Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M10.7508 18.4421L10.5513 18.5867C9.19186 18.17 8.00842 17.3151 7.18555 16.1554L7.26488 15.9092H9.92721L10.7508 18.4421Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M17.7413 16.0656C16.9319 17.2525 15.7488 18.1347 14.3801 18.5716L14.2075 18.4467L15.03 15.9092H17.6923L17.7413 16.0656Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M18.865 12.4349V12.5515L18.7588 12.6286L16.604 11.0583L17.4276 8.52539H17.5443C18.4051 9.64625 18.8707 11.0205 18.8685 12.4338L18.865 12.4349Z"
            fill="#696773"
            stroke="#696773"
            stroke-width="0.752"
            stroke-miterlimit="10"
          /><path
            d="M12.5229 10.1696V8.08594"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M14.6064 11.8007L16.6002 11.0762"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M13.791 14.3379L15.0591 15.8779"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M11.1636 14.3379L9.89551 15.8779"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path
            d="M10.3483 11.8007L8.35449 11.0762"
            stroke="#696773"
            stroke-width="0.644"
            stroke-miterlimit="10"
            stroke-linecap="square"
          /><path d="M20.5702 8.25001C20.4131 8.24935 20.2574 8.27981 20.1121 8.33963C19.9668 8.39945 19.8348 8.48744 19.7237 8.59854C19.6126 8.70964 19.5246 8.84164 19.4648 8.98692C19.405 9.13221 19.3745 9.2879 19.3752 9.44501V12H19.1412V6.83801C19.1418 6.6809 19.1114 6.52521 19.0516 6.37992C18.9917 6.23464 18.9037 6.10264 18.7926 5.99154C18.6816 5.88045 18.5496 5.79245 18.4043 5.73263C18.259 5.67281 18.1033 5.64235 17.9462 5.64301C17.639 5.64825 17.3462 5.77391 17.1307 5.99292C16.9152 6.21193 16.7944 6.50678 16.7942 6.81401V12H16.5632V5.70001C16.5645 5.54248 16.5345 5.38625 16.475 5.24038C16.4155 5.09452 16.3276 4.96193 16.2164 4.8503C16.1053 4.73867 15.973 4.65023 15.8274 4.59009C15.6818 4.52996 15.5257 4.49934 15.3682 4.50001C15.0614 4.50603 14.7691 4.63217 14.5543 4.85131C14.3394 5.07045 14.2191 5.36512 14.2192 5.67201V12H13.9852V6.86701C13.9858 6.71023 13.9555 6.55487 13.8959 6.40985C13.8364 6.26483 13.7487 6.13301 13.6381 6.02197C13.5274 5.91092 13.3959 5.82284 13.251 5.76278C13.1062 5.70273 12.951 5.67188 12.7942 5.67201C12.4867 5.677 12.1934 5.80267 11.9777 6.02193C11.762 6.24118 11.6411 6.53644 11.6412 6.84401V13.757L10.7142 12.483C10.5313 12.2311 10.2558 12.0621 9.9484 12.0132C9.6409 11.9644 9.3266 12.0396 9.0747 12.2225C8.82273 12.4054 8.65373 12.6808 8.60488 12.9883C8.55603 13.2958 8.63131 13.6101 8.81418 13.862L12.4942 18.922C12.6251 19.1017 12.7968 19.2478 12.9952 19.3483C13.1935 19.4487 13.4128 19.5007 13.6352 19.5H19.4242C19.7413 19.5003 20.0493 19.3934 20.298 19.1966C20.5467 18.9998 20.7215 18.7247 20.7942 18.416L21.5712 15.116C21.6707 14.6939 21.721 14.2617 21.7212 13.828V9.42801C21.7228 9.11974 21.6029 8.82325 21.3875 8.60276C21.172 8.38226 20.8784 8.25553 20.5702 8.25001Z" fill="white" stroke="#EF1728" /></svg>
        </div>
      </div>
    </td>
    <td class="player__position">
      {{ player.precisePosition }}
    </td>
    <td class="player__rating">
      {{ player.rating || "-" }}
    </td>
    <td class="player__bonus_rating">
      {{ player.bonusRating }}
    </td>
    <td class="player__total_rating" :class="ratingClass">
      {{ player.rating ? player.getTotalScore() : "-" }}
    </td>
  </tr>
</template>

<script setup>
import { computed } from "vue";
import { Player } from "@/models/Player";

const props = defineProps({
  player: {
    type: Player,
    required: true,
  },
  playerIndex: {
    type: Number,
    required: true,
  },
  scoresMpg: {
    type: Boolean,
    default: false,
  },
  goalSaved: {
    type: Boolean,
    default: false,
  },
});

const ratingClass = computed(() => {
  if (! props.player.rating) {
    return "not-played";
  }

  const playerScore = props.player.getTotalScore();
  switch (true) {
  case playerScore > 6.5:
    return "very-good";
  case playerScore > 5.5:
    return "good";
  case playerScore > 4.5:
    return "medium";
  case playerScore > 3.5:
    return "bad";
  default:
    return "very-bad";
  }
});

</script>

<style lang="scss" scoped>
.player_infos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 5px;

  p {
    margin-bottom: 0;
  }

  &__name {
    min-width: 50%;
    flex-grow: 2;
    text-align: left;
  }

  &__additionnal {
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: flex-end;

    &__cap {
      display: flex;
      box-sizing: border-box;
      background-color: rgba(105, 103, 115, 0.4);
      border-radius: 4px;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      font-size: 15px;
      color: rgb(255, 255, 255);
    }

    &__goals {
      margin-left: 10px;
      svg {
        margin-left: -10px;
      }
    }
  }

}

.player {

  &_infos__number,
  &__position,
  &__rating,
  &__bonus_rating {
    color: #959daf;
  }

  &__total_rating {
    display: inline-block;
    box-sizing: border-box;
    border-radius: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    color: #fff;

    &.not-played {
      background-color: #959daf;
    }
    &.very-good {
      background-color: rgb(120, 199, 61);
    }
    &.good {
      background-color: rgb(181, 224, 37);
    }
    &.medium {
      background-color: rgb(224, 201, 72);
    }
    &.bad {
      background-color: rgb(244, 149, 56);
    }
    &.very-bad {
      background-color: rgb(250, 111, 111);
    }
  }
}
</style>