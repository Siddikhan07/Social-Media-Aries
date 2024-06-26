import React from 'react'
import LogoSearch from '../LogoSearch/LogoSearch'
import './ProfileSide.css'
import ProfileCard from '../ProfileCard/ProfileCard'
import FollowersCard from '../FollowersCard/FollowersCard'
// import TrendCard from '../TrendCard/TrendCard';


const ProfileSide = () => {
  return (
    <div className="ProfileSide">
        <LogoSearch/>
        <ProfileCard location="homePage"/>
        {/* <TrendCard/> */}
        <FollowersCard/>
    </div>
  )
}

export default ProfileSide
