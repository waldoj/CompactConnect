#!/usr/bin/env python3
# Quick script to generate some mock data for test environments
#
# Run from 'backend/compact-connect'
# Required environment variables:
# export LICENSE_TABLE_NAME='Sandbox-PersistentStack-MockLicenseTable12345-ETC'
# export COMPACTS='["aslp", "ot", "counseling"]'
# export JURISDICTIONS='["al", "co"]'

import os
from random import randint

from config import config, logger
from license_csv_reader import LicenseCSVReader
from data_model.schema.license import LicenseRecordSchema


def generate_csv_rows(count):
    i = 0
    while i < count:
        with open(os.path.join('tests', 'resources', 'licenses.csv'), 'r') as f:
            reader = LicenseCSVReader()
            for license_row in reader.validated_licenses(f):
                logger.debug('Read validated license', license_data=reader.schema.dump(license_row))
                yield i, license_row
                i += 1


def put_licenses(jurisdiction: str, count: int = 100):
    schema = LicenseRecordSchema()
    for i, license_data in generate_csv_rows(count):
        ssn = f'{randint(100, 999)}-{randint(10, 99)}-{9999-i}'
        license_data.update({
            'ssn': ssn,
            'compact': 'aslp',
            'jurisdiction': jurisdiction
        })
        logger.info('Put license', license_data=license_data)
        config.license_table.put_item(Item=schema.dump(license_data))


if __name__ == '__main__':
    import logging
    logging.basicConfig()

    put_licenses('co', 100)
    put_licenses('al', 100)
