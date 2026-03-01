module.exports={
    responseMessages: {
        userCreated: 'User created successfully',
        userExists: 'User with this email already exists',
        internalServerError: 'Internal server error',
        loginSuccessful: 'Login successful',
        profileUpdatedSuccessfully:"Profile updated successfully",
        taskCreated:"Task Created Successfully",
        taskAssigned:"Task assigned successfully",
        taskCompleted:"Task marked as completed successfully"
        ,
        teamCreated: 'Team/project created successfully',
        memberAdded: 'Member added to team',
        joinedTeam: 'Successfully joined the team',
        commentAdded: 'Comment added successfully',
        attachmentAdded: 'Attachment added successfully',
        logoutSuccess: 'Logged out successfully'
    },
    errorMessage:{
        emailExists:"Email already in use",
        roleAssignError:"You cannot assign a role to yourself",
        invalidRole:"Invalid role",
        adminAccessErrror:"Only admins Only have access to this.",
        UserNotFound:"User not found",
        closedTask:"The task is closed hence cannot be assigned!",
        notAssignedToTask:"You are not assigned to this task",
        taskAlreadyCompleted:"Task already marked completed",
        teamNotFound: 'Team not found',
        notTeamMember: 'User is not a member of the specified team'
    },
    constantValue:{
        admin:"Admin",
        user:"User"
    },
    Enums:{
        admin:"Admin",
        user:"User",
        open:"open",
        completed:"completed"
    }

}