git add *
git commit -m "更新代码到master分支"
git push

git checkout master
git merge develop
git push origin master