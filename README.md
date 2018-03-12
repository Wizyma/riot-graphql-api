# riot-graphql-api

Unofficial Riot API with GraphQL

How to use
1. clone the project
2. create a .env file a the root
3. add ```API_KEY = "api_key=YOUR_API_KEY"``` to your .env file
4. ```npm install```
5. ```npm run dev```

## CONTRIBUTING

##### For the project
1. Go to the top level riot-graphql-api repository: ([Repo](hhttps://github.com/jsparanoguy/riot-graphql-api))
2. Click the "Fork" Button in the upper right hand corner of the interface
3. clone the project you just forket

#### Setup Your Upstream

1. Change directory to the new riot-graphql-api directory (`cd riot-graphql-api`)
2. Add a remote to the official riot-graphql-api repo:

```shell
$ git remote add upstream https://github.com/jsparanoguy/riot-graphql-api.git
```

##### Rebasing from Upstream

Do this prior to every time you create a branch for a PR:

1. Make sure you are on the `staging` branch

```shell
$ git status
On branch staging
Your branch is up-to-date with 'origin/staging'.
```
If your aren't on `staging`, resolve outstanding files / commits and checkout the `staging` branch

```shell
$ git checkout staging
```

2. Do a pull with rebase against `upstream`

```shell
$ git pull --rebase upstream staging
```

This will pull down all of the changes to the official staging branch, without making an additional commit in your local repo.

3. (_Optional_) Force push your updated staging branch to your GitHub fork

```shell
$ git push origin staging --force
```

This will overwrite the staging branch of your fork.

### Create a Branch

Before you start working, you will need to create a separate branch specific to the issue / feature you're working on. You will push your work to this branch.

#### Naming Your Branch

Name the branch something like `fix/xxx` or `feature/xxx` where `xxx` is a short description of the changes or feature you are attempting to add. For example `fix/email-login` would be a branch where you fix something specific to email login.

#### Adding Your Branch

To create a branch on your local machine (and switch to this branch):

```shell
$ git checkout -b [name_of_your_new_branch]
```

and to push to GitHub:

```shell
$ git push origin [name_of_your_new_branch]
```
