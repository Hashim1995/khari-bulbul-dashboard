/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import { selectOption } from '@/models/common';
import { NomeclaturaType } from '@/enums';
import { dictionary } from './dictionary';

const statusOptions: selectOption[] = [
  {
    value: '1',
    label: dictionary.az.active
  },
  {
    value: '2',
    label: dictionary.az.deactivated
  }
];

const isBlockedOptions: selectOption[] = [
  {
    value: '1',
    label: dictionary.az.blocked
  },
  {
    value: '2',
    label: dictionary.az.unblocked
  }
];

const roleOptions: selectOption[] = [
  {
    value: '1',
    label: dictionary.az.admin
  },
  {
    value: '2',
    label: dictionary.az.moderator
  }
];

const docStatusOptions: selectOption[] = [
  {
    value: 1,
    label: dictionary.az.docStatusAgree
  },
  {
    value: 2,
    label: dictionary.az.docStatusSign
  }
];

const fileTypeOptions: selectOption[] = [
  {
    value: 1,
    label: dictionary.az.fileTypeIsMain
  },
  {
    value: 2,
    label: dictionary.az.fileTypeIsPrivate
  }
];

const genderOptions: selectOption[] = [
  {
    value: '1',
    label: dictionary.az.male
  },
  {
    value: '2',
    label: dictionary.az.female
  }
];

const nomeclaturaTypeOptions: selectOption[] = [
  {
    value: NomeclaturaType.Mal,
    label: 'Mal'
  },
  {
    value: NomeclaturaType.Hazırlama,
    label: 'Hazırlama'
  },
  {
    value: NomeclaturaType.Modificator,
    label: 'Modifikator'
  },
  {
    value: NomeclaturaType.Məhsul,
    label: 'Məhsul'
  },
  {
    value: NomeclaturaType.Tarif,
    label: 'Tarif'
  },
  {
    value: NomeclaturaType.Xidmət,
    label: 'Xidmət'
  }
];

export {
  genderOptions,
  roleOptions,
  fileTypeOptions,
  docStatusOptions,
  isBlockedOptions,
  statusOptions,
  nomeclaturaTypeOptions
};
