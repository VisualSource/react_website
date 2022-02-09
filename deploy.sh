dir=$(pwd)

VERSION='';
re="\"(version)\": \"([^\"]*)\"";

while read -r l; do
    if [[ $l =~ $re ]]; then
        value="${BASH_REMATCH[2]}";
        VERSION="$value";
    fi
done < package.json;

gitbranch="v${VERSION}-react-app"

npm run build
rm ./build/images -r 
rm ./build/favicon.ico

cd ../ 
cd visualsource

git checkout -b $gitbranch

rm ./public/static -r 
rm ./public/asset-manifest.json
rm ./public/index.html
rm ./public/manifest.json

mv "${dir}/build/static" ./public/static
mv "${dir}/build/asset-manifest.json" ./public/asset-manifest.json
mv "${dir}/build/index.html" ./public/index.html
mv "${dir}/build/manifest.json" ./public/manifest.json

git add .

git status

read -p "Press enter to continue"

git commit -a -m "Draft comment for $gitbranch"
git push -u Remote $gitbranch

git checkout master
git branch -d $gitbranch

cd ../ 
cd react_static_website 

rm build -r

read -p "Press enter to continue"


