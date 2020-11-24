# GreenCity

### Custom Exceptions:

1. BadPlaceRequestException

  ● Description: occurs when user try to save place with bad parameters.

  ● Possible Occurance: -

  ● Status Code: 400 – Bad Request

  ● Response Message: -

2. BadRefreshTokenException

● Description: occurs when user try to refresh token with bad refresh token.

● Possible Occurance: GET /ownSecurity/updateAccessToken

● Status Code: 400 – Bad Request

● Response Message: &quot;Refresh token not valid!&quot;

3. BadVerifyEmailTokenException

● Description: occurs when we user try to verify email with bad token.

● Possible Occurance:POST/ownSecurity/changePassword

GET /ownSecurity/verifyEmail

● Status Code: 500 - Internal Server Error

● Response Message: &quot;Token is null or it doesn&#39;t exist!&quot;

&quot;No any email to verify with this token!&quot;

4. EmailNotVerified

● Description: occurs when user try to sign in before email verification.

● Possible Occurance: POST/ownSecurity/signIn

● Status Code: 403 - Forbidden

● Message: &quot;You should verify your email first, check your email box!&quot;

5. EventCreationException

● Description: occurs when event instance cannot be created.

● Possible Occurance: -

● Status Code: 500 - Internal Server Error

● Message: &quot;Can not create instance of events, used constructor that differ from events superclass.&quot;

6. NotCurrentUserException

● Description: occurs when user try to perform some action with data of other user.

● Possible Occurance: in each endpoint that has at least one Long-typed parameter at an arbitrary position.

● Status Code: 400 – Bad Request

● Message: &quot;You can&#39;t perform actions with the data of other user&quot;

7. NotDeleteLastHabit

● Description: -

● Possible Occurance: -

● Status Code: 200 - OK

● Message: -

8. PasswordDoNotMatchesException

● Description: occurs when user&#39;s passwords don&#39;t matches.

● Possible Occurance: - PUT /ownSecurity

● Message: &quot;The passwords don&#39;t matches&quot; - 500 - Internal Server Error

&quot;The password doesn&#39;t match&quot; – 400 - Bad Request

9. TagNotFoundDuringValidation

● Description: occurs when user try to get a tag that isn&#39;t in database.

● Possible Occurance: - POST /tipsandtricks

● Status Code: 500 - Internal Server Error

● Message: &quot;Tips &amp; Tricks should have at least one valid tag.&quot;

10. UserActivationEmailTokenExpiredException

● Description: occurs when user try to verify email with token that has expired.

● Possible Occurance: - POST /ownSecurity/changePassword

GET /ownSecurity/verifyEmail

● Status Code: 500 - Internal Server Error

● Message: &quot;User late with verify. Token is invalid.&quot;

11. UserAlreadyRegisteredException

● Description: occurs when user try to sign-up with email that already registered.

● Possible Occurance: - POST /ownSecurity/signUp

● Status Code: 400 – Bad Request

● Message: &quot;User with this email is already registered&quot;

12. UserBlockedException

● Description: occurs when blocked user try to add place or leave comment.

● Possible Occurance: - POST /place/{placeId}/comments

POST /place/propose

GET /ownSecurity/updateAccessToken

● Status Code: 500 - Internal Server Error

● Message: &quot;User has blocked status&quot;

&quot;User is deactivated&quot;

13. UserDeactivatedException

● Description: occurs when blocked user try to sign-in to deactivated account.

● Possible Occurance: - GET /googleSecurity

POST /ownSecurity/signIn

GET /ownSecurity/updateAccessToken

● Status Code: 500 - Internal Server Error

● Message: &quot;User is deactivated&quot;

14. UserGoalNotSavedException

● Description: -

● Possible Occurance: -

● Status Code: 400 – Bad Request

● Message: -

15. WrongCountOfTagsException

● Description: occurs when user try to receive less than one tag or more than tree.

● Possible Occurance: - POST /econews

● Status Code: 500 - Internal Server Error

● Message: &quot;Count of tags should be at least one but not more three&quot;

16. WrongPasswordException

● Description: occurs when user&#39;s password is wrong.

● Possible Occurance: POST /ownSecurity/signIn

● Status Code: 500 – Internal Server Error

● Message: &quot;Bad password&quot;

17. BadCategoryRequestException

● Description: occurs when user try to save category with bad parameters.

● Possible Occurance: POST /category

● Status Code: 400 – Bad Request

● Message: &quot;Category by this name already exists.&quot;

18. BadRequestException

● Description: occurs when user try to pass bad request.

● Status Code: 400 – Bad Request

● Possible Occurance/Message:

PUT /place/update – &quot;End time have to be late than start time&quot;.

POST /category – &quot;Category by this name already exists&quot;.

POST /econews/comments/{econewsId} – &quot;The comment with entered id doesn&#39;t exist&quot;.

POST /econews/comments/{econewsId} – &quot;Cannot make reply to a reply&quot;.

DELETE /econews/comments – &quot;Current user has no permission for this action&quot;.

PATCH /econews/comments – &quot;You can&#39;t perform actions with the data of the user&quot;.

GET /econews/comments/count/likes – &quot;The comment with entered id doesn&#39;t exist&quot;.

GET /econews/comments/count/replies/{parentCommentId} – &quot;The comment with entered id doesn&#39;t exist&quot;.

DELETE /econews/{econewsId} – &quot;Current user has no permission for this action&quot;.

PUT /econews/update – &quot;Current user has no permission for this action&quot;.

PATCH /goals/shoppingList/{userId} – &quot;You must choose one goal id custom or simple&quot;.

POST /habit/statistic – &quot;Can&#39;t create habit statistic for such date&quot;.

POST /habit/status/enroll/{habitAssignId} – &quot;You can enroll habit once a day&quot;.

POST /habit/status/unenroll/{habitAssignId}/{date} – &quot;Habit is not enrolled&quot;.

POST /habit/status/enroll/{habitAssignId}/{date} – &quot;Habit has been enrolled&quot;.

PUT /place/update – &quot;Close time have to be late than open time&quot;.

PUT /place/update – &quot;Working hours have to contain break with right time&quot;.

POST /place/{placeId}/comments – &quot;Photo is present&quot;.

POST /place/propose – &quot;Location is present&quot;.

POST /place/propose – &quot;Close time have to be late than open time&quot;.

POST /place/propose – &quot;Working hours have to contain break with right time&quot;.

POST /place/propose – &quot;Photo is present&quot;.

POST /tipsandtricks/comments/{tipsAndTricksId} – &quot;The comment with entered id doesn&#39;t exist&quot;.

POST /tipsandtricks/comments/{tipsAndTricksId} – &quot;Cannot reply to deleted comment&quot;.

POST /tipsandtricks/comments/{tipsAndTricksId} – &quot;Cannot make a reply to reply&quot;.

POST /tipsandtricks/comments/{tipsAndTricksId} – &quot;Cannot make a reply with different TipsAndTricks Id&quot;.

DELETE /tipsandtricks/comments– &quot;Current user has no permission for this action&quot;.

PATCH /user/profilePicture– &quot;Image should be download, PNG or JPEG&quot;.

19. BadSocialNetworkLinksException

● Description: occurs when we receive wrong social network links.

● Possible Occurance:PUT/user/profile

● Status Code: 400 – Bad Request

● Response Message: &quot;User cannot add more than 5 social network links&quot;

&quot;User cannot add the same social network links&quot;

20. BadUpdateRequestException

● Description: occurs when we admin/moderator try to update himself.

● Possible Occurance:PATCH/user/role, PATCH /user/status

● Status Code: 500 – Internal Server Error

● Response Message: &quot;User can&#39;t update yourself&quot;

21. DuplicatedTagException

● Description: occurs when user try to use not unique (duplicated) tags.

● Possible Occurance:POST /tipsandtricks

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Tips &amp; Tricks tags should be unique&quot;

22. GoalNotFoundException

● Description: occurs when user try to use non-existsing goal.

● Possible Occurance:-

● Status Code: 400 – Bad Request

● Response Message: &quot;There is no goal for such language&quot;

23. InvalidNumberOfTagsException

● Description: occurs when user try to use more than 3 tags.

● Possible Occurance:- POST /tipsandtricks

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Invalid tags. You must have less than 3 tags&quot;

24. InvalidUnsubscribeToken

● Description: occurs when user try to use invalid unsubscribe token.

● Possible Occurance:- GET /newsSubscriber/unsubscribe

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Invalid unsubscribe token&quot;

25. InvalidURLException

● Description: occurs when we receive a malformed URL or received string could not be parse as a URI reference.

● Possible Occurance:- POST /econews

POST /tipsandtricks

● Status Code: 400 – Bad Request

● Response Message: &quot;Malformed URL. The string could not be parsed.&quot;

&quot;The string could not be parsed as a URI reference&quot;

26. LanguageNotFoundException

● Description: occurs when user try to save object with language code that doesn&#39;t exist in database.

● Possible Occurance:- POST /management/factoftheday

PUT /management/factoftheday

POST /management/habits/save

POST /management/tipsandtricks

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Given language code is not supported&quot;

27. LowRoleLevelException

● Description: occurs when moderator try to update user status of admin or another moderator.

● Possible Occurance:- PATCH /user/status

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Impossible to update status admin or moderator&quot;

28. NewsSubscriberPresentException

● Description: occurs when user try to subscribe or unsubscribe news

● Possible Occurance:- POST /newsSubscriber

GET /newsSubscriber/unsubscribe

● Status Code: 500 – Internal Server Error

● Response Message:

&quot;Subscriber with this email address exists in the database&quot;

&quot;Subscriber with this email address not found in the database&quot;

29. NotDeletedException

● Description: occurs when user try to delete some object, but such object isn&#39;t exist

● Status Code: 500 – Internal Server Error

● Possible Occurance/Message:

DELETE /advices/{adviceId}- &quot;Advice not deleted&quot;

DELETE /facts/{factId}- &quot;The habit fact does not deleted by id&quot;

DELETE /management/habits/delete-&quot;Status of user habit wasn&#39;t deleted by id: {id}&quot;

DELETE /management/habits/deleteAll-&quot;Status of user habit wasn&#39;t deleted by id: {id}&quot;

DELETE /user/{userId}/userFriend/{friendId}-&quot;You don&#39;t have friend with this id: {friendId}&quot;

30. NotFoundException

● Description: occurs when we send a request (for example: _findById_) and there is no record with this id.

● Status Code: 404 – Not Found

● Possible Occurance: may occur in requests where server needs to send a query to DB to retrive the record by ID (primary key). It could be performed with every entity in application.

● Message: The messages with different entities is very similar to each other. It looks like that: _&quot;\&lt;entity name\&gt;_ does not exist by this id: _\&lt;entity id\&gt;&quot;_ (Example: &quot;The _discount_ does not exist by this id: _5_&quot; or &quot;The _comment_ with entered id doesn&#39;t exist&quot;)

31. NotSavedException

● Description: occurs when user try to save obejct, but such object already exists.

● Status Code: 500 – Internal Server Error

● Possible Occurance/Message:

PUT /management/eco-news

PUT /econews/update

POST /management/habits/save

PUT /management/habits/update

POST /management/socialnetworksi

PUT /user/profile

PUT /management/socialnetworksimages

POST /tipsandtricks

POST /management/tipsandtricks

PATCH /user/profilePicture mages &quot;File hasn&#39;t been saved&quot;

POST /econews - &quot;Eco news haven&#39;t been saved because of constraint violation&quot;

POST /management/eco-news - &quot;Eco news haven&#39;t been saved because of constraint violation&quot;

POST /habit/statistic - &quot;Habit statistic already exists by such date

POST /management/socialnetworksimages – &quot;Social network image hasn&#39;t been saved&quot;

POST /tipsandtricks – &quot;Tips &amp; Tricks advice hasn&#39;t been saved due to constraint violation&quot;

32. NotUpdatedException

● Description: occurs when we try to update some obejct, but such object doesn&#39;t exist.

● Status Code: 500 – Internal Server Error

● Possible Occurance: may occur in requests where server needs to send a query to DB to retrive the record by ID (primary key). It could be performed with every entity in application.

● Message: The messages with different entities is very similar to each other. It looks like that: _&quot;\&lt;entity name\&gt;_ does not exist by this id: <entity id> (Example: &quot;The _discount_ does not exist by this id: _5_&quot; or &quot;The _comment_ with entered id doesn&#39;t exist&quot;)

33. PlaceStatusException

● Description: occurs when user try to add status to place, but this place has already this status.

● Possible Occurance:- PATCH /place/status

DELETE /place/{id}

DELETE /management/places

DELETE /place

DELETE /management/places/deleteAll

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Place with _\&lt;id\&gt;_ already has this status: _\&lt;status\&gt;&quot;_

34. TagNotFoundException

● Description: occurs when user try to get a tag that isn&#39;t in the database.

● Possible Occurance:- POST /econews

POST /management/eco-news

PUT /econews/update

POST /tipsandtricks

● Status Code: 500 – Internal Server Error

● Response Message: &quot;Tips &amp; Tricks should have at least one valid tag._&quot;_

35. UserAlreadyHasHabitAssignedException

● Description: occurs when user try to assign the habit that is already assigned.

● Possible Occurance:- POST /habit/assign/{habitId}

● Status Code: 400 – Bad Request

● Response Message:

&quot;Current user already has assigned habit with id: {id}._&quot;_

&quot;User already assigned and suspended this habit for today with id: {id}._&quot;_

36. UserGoalStatusNotUpdatedException

● Description: occurs when user try to update goal that doesn&#39;t exist in the database.

● Possible Occurance:- PATCH /user/{userId}/goals/{goalId}

● Status Code: 400 – Bad Request

● Response Message: &quot;This user has no goal with id: {goalId}&quot;

37. UserHasNoAvailableGoalsException

● Description: occurs when user hasn&#39;t available goals.

● Possible Occurance:- GET /user/{userId}/goals/available

● Status Code: 500 – Internal Server Error

● Response Message: &quot;This user is tracking all available goals&quot;

38. UserHasNoGoalsException

● Description: occurs when user hasn&#39;t any goals.

● Possible Occurance:- GET /user/{userId}/goals

POST /user/{userId}/goals

● Status Code: 400 – Bad Request

● Response Message: &quot;This user hasn&#39;t selected any goals yet&quot;

39. WrongEmailException

● Description: occurs when user doesn&#39;t exist by given email.

● Status Code: 400 – Bad Request

● Message: The user doesn&#39;t exist by this email.

40. WrongIdException

● Description: occurs when in some logic we have bad ID.

● Status Code: 400 – Bad Request

● Message: The \&lt;_entity_\&gt; does not exist by this id: _\&lt;id\&gt;._

### Built-In Exceptions:

1. ConstraintViolationException

● Description: occurs when some entity violates constraint rules.

● Example: when text in the comment has less than 5 characters.

● Status Code: 400 – Bad Request

2. AuthenticationException

● Description: occurs when unauthorized user try to perform actions that are available only for authorized users.

● Status Code: 401 – Unauthorized

3. DateTimeParseException

● Description: occurs when user try to pass date with wrong format.

● Status Code: 400 – Bad Request

● Message: &quot;The date format is wrong. Should matches dd/MM/yyyy HH:mm:ss&quot;
