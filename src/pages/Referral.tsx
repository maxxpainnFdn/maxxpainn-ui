
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Referral() {
  
  const { clanId, userAccountId="a-0" } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    
    const clanIdNo = Number.parseInt(clanId.replace("c-",""))
    const userAcctIdNo = Number.parseInt(userAccountId.replace("a-",""))
    
    if (!(Number.isNaN(clanIdNo) && Number.isNaN(userAcctIdNo))) {
      const referrerInfo = { clanId: clanIdNo, userAccountId: userAcctIdNo }
      localStorage.setItem("referral_info", JSON.stringify(referrerInfo))
    }
    
    navigate("/")
  }, [])
  
};
