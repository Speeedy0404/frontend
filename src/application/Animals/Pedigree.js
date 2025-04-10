import React from 'react';


const Pedigree = ({ parentData, onParentClick }) => {
  // Функция для поиска родителя по типу (ped) в массиве родословной
  const findParent = (type) => {
    // Если данных нет – возвращаем объект с дефолтными значениями
    return (
      parentData.find(parent => parent.ped === type) || {
        klichka: 'Нет данных',
        uniq_key: 'Нет данных',
        // Можно добавить поле animalType, чтобы знать, какой тип наследуемого животного
        animalType: type.includes('father') ? 'bull' : 'cow'
      }
    );
  };

  const mother = findParent('mother');
  const father = findParent('father');
  const motherOfMother = findParent('mother of mother');
  const fatherOfMother = findParent('father of mother');
  const motherOfFather = findParent('mother of father');
  const fatherOfFather = findParent('father of father');

  return (
    <div className="pedigree">
      <h3>Родословная</h3>
      <div className="pedigree-container">
        <div className="pedigree-column">
          <div
            className="parent-name clickable"
            onClick={() => onParentClick(mother.animalType || 'cow', mother.uniq_key)}
          >
            Мать: {mother.klichka} (№ {mother.uniq_key})
          </div>
          <div className="pedigree-subrow">
            <div
              className="sub-parent clickable"
              onClick={() => onParentClick(motherOfMother.animalType || 'cow', motherOfMother.uniq_key)}
            >
              Мама матери: {motherOfMother.klichka} (№ {motherOfMother.uniq_key})
            </div>
            <div
              className="sub-parent clickable"
              onClick={() => onParentClick(fatherOfMother.animalType || 'bull', fatherOfMother.uniq_key)}
            >
              Отец матери: {fatherOfMother.klichka} (№ {fatherOfMother.uniq_key})
            </div>
          </div>
        </div>
        <div className="pedigree-column">
          <div
            className="parent-name clickable"
            onClick={() => onParentClick(father.animalType || 'bull', father.uniq_key)}
          >
            Отец: {father.klichka} (№ {father.uniq_key})
          </div>
          <div className="pedigree-subrow">
            <div
              className="sub-parent clickable"
              onClick={() => onParentClick(motherOfFather.animalType || 'cow', motherOfFather.uniq_key)}
            >
              Мама отца: {motherOfFather.klichka} (№ {motherOfFather.uniq_key})
            </div>
            <div
              className="sub-parent clickable"
              onClick={() => onParentClick(fatherOfFather.animalType || 'bull', fatherOfFather.uniq_key)}
            >
              Отец отца: {fatherOfFather.klichka} (№ {fatherOfFather.uniq_key})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pedigree;
