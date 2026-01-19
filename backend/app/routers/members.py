from fastapi import APIRouter, HTTPException
from typing import List, Optional
import uuid
from datetime import date
from app.models import Member, MemberCreate
from app.data_handler import read_data, write_data

router = APIRouter(prefix="/members", tags=["members"])

@router.get("/", response_model=List[Member])
def get_members(search: Optional[str] = None):
    members = read_data("members")
    if search:
        search = search.lower()
        members = [
            m for m in members
            if search in m["name"].lower() or search in m["id"].lower()
        ]
    return members

@router.post("/", response_model=Member)
def create_member(member: MemberCreate):
    members = read_data("members")
    
    # Check duplicate email
    if any(m["email"] == member.email for m in members):
        raise HTTPException(status_code=400, detail="Member with this email already exists")

    new_member = member.model_dump()
    new_member["id"] = str(uuid.uuid4())
    new_member["joined_date"] = str(date.today())
    
    members.append(new_member)
    write_data("members", members)
    return new_member

@router.put("/{member_id}", response_model=Member)
def update_member(member_id: str, member_update: MemberCreate):
    members = read_data("members")
    for i, member in enumerate(members):
        if member["id"] == member_id:
            updated_member = member_update.model_dump()
            updated_member["id"] = member_id
            updated_member["joined_date"] = member["joined_date"]
            
            members[i] = updated_member
            write_data("members", members)
            return updated_member
    raise HTTPException(status_code=404, detail="Member not found")

@router.delete("/{member_id}")
def delete_member(member_id: str):
    members = read_data("members")
    new_members = [m for m in members if m["id"] != member_id]
    if len(members) == len(new_members):
        raise HTTPException(status_code=404, detail="Member not found")
    
    write_data("members", new_members)
    return {"message": "Member deleted successfully"}
